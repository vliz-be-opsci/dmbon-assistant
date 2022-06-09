from fastapi import APIRouter
from .profiles import router as profile_router
from .spaces import router as space_router
from.projects import router as project_router
#make the routers
router = APIRouter()
router.include_router(profile_router, prefix="/profiles")
router.include_router(project_router, prefix="/projects")
router.include_router(space_router, prefix="/spaces")

