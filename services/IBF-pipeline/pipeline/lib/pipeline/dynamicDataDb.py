import psycopg2
from psycopg2 import sql as psql
from sqlalchemy import create_engine, text
import pandas as pd
import geopandas as gpd
import requests
import json

from lib.logging.logglySetup import logger
from lib.setup.setupConnection import get_db
from settings import *
from secrets import DB_SETTINGS, ADMIN_LOGIN, ADMIN_PASSWORD, DATALAKE_STORAGE_ACCOUNT_NAME, DATALAKE_STORAGE_ACCOUNT_KEY, DATALAKE_API_VERSION


class DatabaseManager:

    """ Class to upload and process data in the database """

    def __init__(self, leadTimeLabel, countryCodeISO3):
        self.countryCodeISO3 = countryCodeISO3
        self.leadTimeLabel = leadTimeLabel
        self.engine = create_engine(
            'postgresql://'+DB_SETTINGS['user']+':'+DB_SETTINGS['password']+'@'+DB_SETTINGS['host']+':'+DB_SETTINGS['port']+'/'+DB_SETTINGS['db'])
        self.triggerFolder = PIPELINE_OUTPUT + "triggers_rp_per_station/"
        self.affectedFolder = PIPELINE_OUTPUT + "calculated_affected/"
        self.EXPOSURE_DATA_SOURCES = SETTINGS[countryCodeISO3]['EXPOSURE_DATA_SOURCES']

    def upload(self):
        if SETTINGS[self.countryCodeISO3]['model'] == 'glofas':
            self.uploadTriggersPerLeadTime()
            self.uploadTriggerPerStation()
        self.uploadCalculatedAffected()
    
    def addDisasterType(self):
        if SETTINGS[self.countryCodeISO3]['model'] == 'glofas':
            disasterType = 'floods'
        elif SETTINGS[self.countryCodeISO3]['model'] == 'rainfall':
            disasterType = 'heavy-rain'
        return disasterType

    def uploadCalculatedAffected(self):
        for indicator, values in self.EXPOSURE_DATA_SOURCES.items():
            with open(self.affectedFolder +
                      'affected_' + self.leadTimeLabel + '_' + self.countryCodeISO3 + '_' + indicator + '.json') as json_file:
                body = json.load(json_file)
                body['disasterType'] = self.addDisasterType()
                self.apiPostRequest('admin-area-dynamic-data/exposure', body)
            print('Uploaded calculated_affected for indicator: ' + indicator)
            if indicator == 'population':
                with open(self.affectedFolder +
                        'affected_' + self.leadTimeLabel + '_' + self.countryCodeISO3 + '_' + 'population_affected_percentage' + '.json') as json_file:
                    body = json.load(json_file)
                    body['disasterType'] = self.addDisasterType()
                    self.apiPostRequest('admin-area-dynamic-data/exposure', body)
                print('Uploaded calculated_affected for indicator: ' + 'population_affected_percentage')

    def uploadTriggerPerStation(self):
        df = pd.read_json(self.triggerFolder +
                          'triggers_rp_' + self.leadTimeLabel + '_' + self.countryCodeISO3 + ".json", orient='records')
        dfStation = pd.DataFrame(index=df.index)
        dfStation['stationCode'] = df['stationCode']
        dfStation['forecastLevel'] = df['fc']
        dfStation['forecastProbability'] = df['fc_prob']
        dfStation['forecastTrigger'] = df['fc_trigger']
        dfStation['forecastReturnPeriod'] = df['fc_rp']
        stationForecasts = json.loads(dfStation.to_json(orient='records'))
        body = {
            'countryCodeISO3': self.countryCodeISO3,
            'leadTime': self.leadTimeLabel,
            'stationForecasts': stationForecasts
        }
        self.apiPostRequest('glofas-stations/triggers', body)
        print('Uploaded triggers per station')

    def uploadTriggersPerLeadTime(self):
        with open(self.triggerFolder +
                  'trigger_per_day_' + self.countryCodeISO3 + ".json") as json_file:
            triggers = json.load(json_file)[0]
            triggersPerLeadTime = []
            for key in triggers:
                triggersPerLeadTime.append({
                    'leadTime': str(key),
                    'triggered': triggers[key]
                })
            body = {
                'countryCodeISO3': self.countryCodeISO3,
                'triggersPerLeadTime': triggersPerLeadTime
            }
            body['disasterType'] = self.addDisasterType()
            self.apiPostRequest('event/triggers-per-leadtime', body)
        print('Uploaded triggers per leadTime')

    def apiGetRequest(self, path, countryCodeISO3):
        TOKEN = self.apiAuthenticate()

        response = requests.get(
            API_SERVICE_URL + path + '/' + countryCodeISO3,
            headers={'Authorization': 'Bearer ' + TOKEN}
        )
        data = response.json()
        return(data)

    def apiPostRequest(self, path, body):
        TOKEN = self.apiAuthenticate()

        r = requests.post(
            API_SERVICE_URL + path,
            json=body,
            headers={'Authorization': 'Bearer ' + TOKEN,
                     'Content-Type': 'application/json', 'Accept': 'application/json'}
        )
        if r.status_code >= 400:
            print(r.text)
            raise ValueError()

    def apiAuthenticate(self):
        login_response = requests.post(API_LOGIN_URL, data=[(
            'email', ADMIN_LOGIN), ('password', ADMIN_PASSWORD)])
        return login_response.json()['user']['token']

    def getDataFromDatalake(self, path):
        import requests
        import datetime
        import hmac
        import hashlib
        import base64

        request_time = datetime.datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
        file_system_name = 'ibf/' + path
        print('Downloading from datalake: ', file_system_name)

        string_params = {
            'verb': 'GET',
            'Content-Encoding': '',
            'Content-Language': '',
            'Content-Length': '',
            'Content-MD5': '',
            'Content-Type': '',
            'Date': '',
            'If-Modified-Since': '',
            'If-Match': '',
            'If-None-Match': '',
            'If-Unmodified-Since': '',
            'Range': '',
            'CanonicalizedHeaders': 'x-ms-date:' + request_time + '\nx-ms-version:' + DATALAKE_API_VERSION,
            'CanonicalizedResource': '/' + DATALAKE_STORAGE_ACCOUNT_NAME+'/'+file_system_name
        }

        string_to_sign = (string_params['verb'] + '\n'
                          + string_params['Content-Encoding'] + '\n'
                          + string_params['Content-Language'] + '\n'
                          + string_params['Content-Length'] + '\n'
                          + string_params['Content-MD5'] + '\n'
                          + string_params['Content-Type'] + '\n'
                          + string_params['Date'] + '\n'
                          + string_params['If-Modified-Since'] + '\n'
                          + string_params['If-Match'] + '\n'
                          + string_params['If-None-Match'] + '\n'
                          + string_params['If-Unmodified-Since'] + '\n'
                          + string_params['Range'] + '\n'
                          + string_params['CanonicalizedHeaders']+'\n'
                          + string_params['CanonicalizedResource'])

        signed_string = base64.b64encode(hmac.new(base64.b64decode(
            DATALAKE_STORAGE_ACCOUNT_KEY), msg=string_to_sign.encode('utf-8'), digestmod=hashlib.sha256).digest()).decode()
        headers = {
            'x-ms-date': request_time,
            'x-ms-version': DATALAKE_API_VERSION,
            'Authorization': ('SharedKey ' + DATALAKE_STORAGE_ACCOUNT_NAME + ':' + signed_string)
        }
        url = ('https://' + DATALAKE_STORAGE_ACCOUNT_NAME +
               '.dfs.core.windows.net/'+file_system_name)
        r = requests.get(url, headers=headers)
        return r
