from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['projectName', 'status', 'lead', 'lastUpdated']
    list_filter = ['status', 'lastUpdated']
    search_fields = ['projectName', 'lead']
    readonly_fields = ['id', 'lastUpdated'] 