import logging
import logging.config
import os
import sys
import pytest
import yaml
from dotenv import load_dotenv


log = logging.getLogger('tests')


def enable_test_logging():
    load_dotenv()
    if 'PYTEST_LOGCONF' in os.environ:
        logconf = os.environ['PYTEST_LOGCONF']
        with open(logconf, 'r') as yml_logconf:
            logging.config.dictConfig(yaml.load(yml_logconf, Loader=yaml.SafeLoader))
        log.info(f"Logging enabled according to config in {logconf}")
        print(logconf)
        
def make_root_folder(root_folder):
    try:
        os.makedirs(root_folder, exist_ok=True)
    except Exception as e:
        log.info(e)
        log.exception(e)
        
workspace_folder = os.path.join(os.getcwd(),'tests','tmp_workspace')

def run_single_test(testfile):
    enable_test_logging()
    make_root_folder(root_folder=workspace_folder)
    log.info(
        f"Running tests in {testfile} " +
        "with -v(erbose) and -s(no stdout capturing) " +
        "and logging to stdout, level controlled by env var ${PYTEST_LOGCONF}")
    sys.exit(pytest.main(["-v", "-s",  testfile]))
