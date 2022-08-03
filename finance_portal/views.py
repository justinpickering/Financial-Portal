from functools import total_ordering
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User, Networth



# Create your views here.

def index(request):
    if request.user.is_authenticated:
        return render(request, "finance_portal/dashboard.html")
    else:
        return HttpResponseRedirect(reverse("login"))

#API CALL
def dashboard(request):

    entries = Networth.objects.filter(user=request.user)


    return JsonResponse([entry.serialize() for entry in entries], safe=False)

    
@csrf_exempt
def submit(request):
    if request.method == "POST":

        data = json.loads(request.body)

        print("hey!")

        user = request.user


        #get numbers from form
        taxable = data.get("taxable", "")
        tfsa = data.get("tfsa", "")
        rrsp = data.get("rrsp", "")
        other_investable = data.get("other_investable", "")

        bitcoin = data.get("bitcoin", "")
        ethereum = data.get("ethereum", "")
        other_crypto = data.get("other_crypto", "")

        hard_cash = data.get("hard_cash", "")
        checkings = data.get("checkings", "")
        savings = data.get("savings", "")
        other_cash = data.get("other_cash", "")

        principal_residence = data.get("principal_residence", "")
        auto = data.get("auto", "")
        other_properties = data.get("other_properties", "")
        goods = data.get("goods", "")

        mortgages = data.get("mortgages", "")
        consumer_debt = data.get("consumer_debt", "")
        loans = data.get("loans", "")
        other_debt = data.get("other_debt", "")

        assets = int(taxable)+int(tfsa)+int(rrsp)+int(other_investable)+int(bitcoin)+int(ethereum)+int(other_crypto)+int(hard_cash)+int(checkings)+int(savings)+int(other_cash)+int(principal_residence)+int(auto) + int(other_properties) + int(goods)
        total_liability = int(mortgages) + int(consumer_debt) + int(loans) + int(other_debt)

        total_investable = int(taxable)+int(tfsa)+int(rrsp)+int(other_investable)
        total_crypto = int(bitcoin)+int(ethereum)+int(other_crypto)
        total_cash = int(hard_cash)+int(checkings)+int(savings)+int(other_cash)
        total_personal = int(principal_residence)+int(auto) + int(other_properties) + int(goods)

        print("total_crypto", total_crypto)

        #calculate networth for the entry
        networth = (assets - total_liability)


        #enter data into database as an entry
        entry = Networth(
            user=user,

            tfsa=tfsa,
            rrsp = rrsp,
            taxable=taxable,
            other_investable=other_investable,

            bitcoin=bitcoin,
            ethereum=ethereum,
            other_crypto = other_crypto,

            hard_cash=hard_cash,
            checkings=checkings,
            savings=savings,
            other_cash=other_cash,

            principal_residence=principal_residence,
            auto=auto,
            other_properties=other_properties,
            goods=goods,

            mortgages=mortgages,
            consumer_debt=consumer_debt,
            loans=loans,
            other_debt=other_debt,

            total_networth=networth,
            total_investable=total_investable,
            total_crypto=total_crypto,
            total_cash=total_cash,
            total_personal=total_personal
        )
        entry.save()

    return JsonResponse({"message": "Entry submitted succesfully"}, status=201)


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "finance_portal/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "finance_portal/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "finance_portal/register.html")


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            print("yes")
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "finance_portal/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "finance_portal/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

