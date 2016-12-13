#  download quotes of the week from knack
#  find the latest
#  commit it to github

import arrow
import requests
import json
import github_updater
from secrets import KNACK_CREDENTIALS
from secrets import GITHUB_CREDENTIALS

import pdb

REPO_URL_GITHUB = 'https://api.github.com/repos/cityofaustin/transportation-logs/contents/'
DATA_URL_GITHUB = 'https://raw.githubusercontent.com/cityofaustin/transportation-logs/master/'
DATASET_FIELDNAMES = ['date_time', 'socrata_errors', 'socrata_updated', 'socrata_created', 'socrata_deleted', 'no_update', 'update_requests', 'insert_requests', 'delete_requests', 'not_processed','response_message']

KNACK_CONFIG = {}

then = arrow.now()
ta


def main(date_time):
    print('starting stuff now')

    try:
        
        #  github_updater.update_github_repo(date_time, logfile_data, DATASET_FIELDNAMES, REPO_URL_GITHUB, DATA_URL_GITHUB, logfile_filename)

        return 'icey cool flavor'

    except Exception as e:
        print('Failed to process data for {}'.format(date_time))
        print(e)
        raise e
 

results = main(then)

print('Elapsed time: {}'.format(str(arrow.now() - then)))


