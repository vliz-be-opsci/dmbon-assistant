from fastapi import APIRouter
from .profiles import router as profile_router
from .spaces import router as space_router
from.projects import router as project_router
from .tasks import router as task_router
from .docker_test import router as docker_test_router
#make the routers
router = APIRouter()
router.include_router(profile_router, prefix="/profiles")
router.include_router(project_router, prefix="/projects")
router.include_router(space_router, prefix="/spaces")
router.include_router(task_router, prefix="/tasks")
router.include_router(docker_test_router, prefix="/docker_test")

