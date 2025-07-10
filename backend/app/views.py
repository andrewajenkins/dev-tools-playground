import time
import random
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer, LoginSerializer


@api_view(['POST'])
def login_view(request):
    """
    Mock login endpoint - accepts any username/password combination
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        # Mock authentication - always return success
        return Response({
            'success': True,
            'message': 'Login successful',
            'token': 'mock-jwt-token-for-testing'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectListView(generics.ListAPIView):
    """
    Get all projects with intentional performance delay for testing
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def get(self, request, *args, **kwargs):
        # Intentional performance bottleneck for perf-sentinel testing
        # Base delay of 200ms plus random 0-150ms
        base_delay = 0.2  # 200ms
        random_delay = random.uniform(0, 0.15)  # 0-150ms
        total_delay = base_delay + random_delay
        
        print(f"[PERF-TESTING] API delay: {total_delay:.3f}s")
        time.sleep(total_delay)
        
        return super().get(request, *args, **kwargs)


class ProjectCreateView(generics.CreateAPIView):
    """
    Create a new project
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer 