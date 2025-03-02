# IBF-pipeline

This is a series of scripts (which will be run daily) which extracts all input data (static + dynamic), transforms them to create flood extents and calculated affected population, and loads the output to locations where they can be served to the dashoard.

This pipeline contains logic for 2 different disaster types / models: (will be split in the future)
1. Floods/GloFAS
2. Heavy Rainfall

## Prerequisites

For the GloFAS pipeline to work (to be able to get in daily forecast data)
  - The IBF-pipeline needs to be able to connect to an Azure Datalake instance, which needs to be set up
  - which in turn needs to be filled by an Azure Data Factory pipeline
  - which in turn needs to be triggered daily via an Azure Logic App
  - Specifically this means that if this application is handed over to be hosted by someone other than 510
    - the Datalake and ADF pipeline and Azure logic app resources need to be handed-over / replicated as well
    - or the hoster needs to get access to the 510 Azure resources
    - See IBF Project Document for more info and specific links to the above mentioned resources.

## Installation

See the root README for starting up the IBF-pipeline as part of the whole IBF-system.

## Stand-alone instalation

We keep here the (outdate) readme for stand-alone installation. This is still possible, but you would need to make sure that other components such as the database and the API-service are also running. The best way to do so, is by starting up the IBF-system alltogether > see root README.

### Prerequisites

1. Install Docker

### Installation

1. Clone this directory to `<your_local_directory>`/IBF-pipeline/
2. Change `/pipeline/secrets.py.template` to `secrets.py` and fill in the necessary passwords.
3. Find data.zip in https://rodekruis.sharepoint.com/sites/510-CRAVK-510/_layouts/15/guestaccess.aspx?folderid=0fa454e6dc0024dbdba7a178655bdc216&authkey=AcqhM85JHZY8cc6H7BTKgO0&expiration=2021-11-29T23%3A00%3A00.000Z&e=qkUx50 and unzip in /pipeline/data.

### Set up Data pipeline

1. Build Docker image (from the IBF-pipeline root folder) and run container with volume. ${PWD} should take automatically your Present Working Directory as the local folder to attach the volume though; if this fails, you can always replace it by the literal path (e.g. "C:/IBF-system/services/IBF-pipeline:/home/ibf" instead of "${PWD}:/home/ibf")

```
build image: docker build . -t ibf-pipeline
create + start container: docker run --name=ibf-pipeline -v ${PWD}:/home/ibf -it ibf-pipeline
access container (if the previous command didn't get you in already): docker exec -it ibf-pipeline bash
access container (if the container exists already): docker exec -it ibf-pipeline bash
remove container (to be able to recreate with same name): docker rm -f ibf-pipeline
```

2. All other scripts are summarized in runPipeline.py (as it will be run daily). Test it through:

```
python3 runPipeline.py
```

3. Cronjob: locally, you probably don't want to run this automatically every day. If you want to, copy the cron command in /docker-compose.yml and replace the last line of /services/IBF-pipeline/Dockerfile with it.

### Logging loggly and SMTPHandler for logging (OPTIONAL)

1.  Create a gmail account add to EMAIL_USERNAME in settings.py add your password to secrets.py
2.  Create loggly account and set your token in python.conf; replace YOURTOKEN in the variable args 'https://logs-01.loggly.com/inputs/YOURTOKEN/tag/python' (see https://www.loggly.com/docs/python-http/ point 2)
3.  Add email addresses that want to receive an email when an error occurs to LOGGING_TO_EMAIL_ADDRRESSES in settings.py
4.  In settings.py set LOGGING to True

### Sending notification with mailchimp (OPTIONAL)

1.  Create account: https://mailchimp.com/help/create-an-account/ add username to `secrets.py`
2.  Create maillist: https://mailchimp.com/help/create-audience/ and add list id to `secrets.py` https://mailchimp.com/help/find-audience-id/
3.  Create API key: https://mailchimp.com/help/about-api-keys/#Find-or-Generate-Your-API-Key add it to `secrets.py`
4.  Set 'notify_email' per country to `True` in `secrets.py`
