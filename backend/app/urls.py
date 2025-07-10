from django.urls import path
from .views import login_view, ProjectListView, ProjectCreateView

urlpatterns = [
    path('login/', login_view, name='login'),
    path('projects/', ProjectListView.as_view(), name='projects-list'),
    path('projects/create/', ProjectCreateView.as_view(), name='projects-create'),
] 