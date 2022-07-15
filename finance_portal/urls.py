
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("login", views.login_view, name="login"),
    path("submit", views.submit, name="submit"),
    
    path("dashboard", views.dashboard, name="dashboard"),
    path("dashboard", views.dashboard, name="dashboard")
]
