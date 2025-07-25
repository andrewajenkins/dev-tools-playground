from django.core.management.base import BaseCommand
from faker import Faker
import random
from app.models import Project

class Command(BaseCommand):
    help = 'Seed database with mock project data'
    
    def handle(self, *args, **options):
        # Only seed if there are no projects
        if Project.objects.exists():
            self.stdout.write(self.style.SUCCESS('Database already seeded. Skipping.'))
            return

        fake = Faker()
        
        # Generate 120 mock projects
        projects = []
        status_choices = ['On Track', 'At Risk', 'Delayed']
        
        for i in range(120):
            project = Project(
                projectName=fake.catch_phrase(),
                status=random.choice(status_choices),
                lead=fake.name(),
            )
            projects.append(project)
        
        # Bulk create all projects
        Project.objects.bulk_create(projects)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded {len(projects)} projects')
        ) 