from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'projectName', 'status', 'lead', 'lastUpdated']
        read_only_fields = ['id', 'lastUpdated']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField() 