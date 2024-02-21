from django.urls import include, path
from .views import *

urlpatterns = [
    path('clock/', clock, name='get clock'),
    path('lookup/', symbol_lookup, name='symbol lookup'),
    path('lookup/<security_type>', symbol_lookup, name='symbol lookup'),
    path('search/', symbol_search, name='symbol search')
]