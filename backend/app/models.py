import uuid
from django.db import models


class Project(models.Model):
    STATUS_CHOICES = [
        ('On Track', 'On Track'),
        ('At Risk', 'At Risk'),
        ('Delayed', 'Delayed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    projectName = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    lead = models.CharField(max_length=255)
    lastUpdated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-lastUpdated']
        
    def __str__(self):
        return self.projectName 