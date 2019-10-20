from django.contrib.auth import authenticate, get_user_model, login
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response

from ... import captcha
from ....legal.models import Agreement
from ...forms.register import RegisterForm
from ...registration import (
    get_registration_result_json,
    save_user_agreements,
    send_welcome_email,
)
from ...profilefields import profilefields
from ...setupnewuser import setup_new_user

User = get_user_model()


@csrf_protect
def create_endpoint(request):
    if request.settings.account_activation == "closed":
        raise PermissionDenied("Δεν επιτρέπεται η εγγραφή νέων χρηστών αυτή τη στιγμή...")

    request_data = request.data
    if not isinstance(request_data, dict):
        request_data = {}

    form = RegisterForm(
        request_data, request=request, agreements=Agreement.objects.get_agreements()
    )

    try:
        if form.is_valid():
            captcha.test_request(request)
    except ValidationError as e:
        form.add_error("captcha", e)

    if not form.is_valid():
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    activation_kwargs = {}
    if request_data["engineer_or_customer"] == "engineer" or request_data["engineer_or_customer"] == "engineer_te":
        activation_kwargs = {"requires_activation": User.ACTIVATION_ADMIN}
    elif request_data["engineer_or_customer"] == "customer":
        activation_kwargs = {"requires_activation": User.ACTIVATION_USER}

    try:
        new_user = User.objects.create_user(
            username=form.cleaned_data["username"],
            password=form.cleaned_data["password"],
            email=form.cleaned_data["email"],
            joined_from_ip=request.user_ip,
            **activation_kwargs
        )
    except IntegrityError:
        return Response(
            {"__all__": "Προσπάθησε ξανά..."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    profilefields.add_fields_to_form(request, new_user, form)
    profilefields.update_user_profile_fields(request, new_user, form)
    new_user.save()

    setup_new_user(request.settings, new_user)
    save_user_agreements(new_user, form)
    send_welcome_email(request, new_user)

    if new_user.requires_activation == User.ACTIVATION_NONE:
        authenticated_user = authenticate(
            username=new_user.email, password=form.cleaned_data["password"]
        )
        login(request, authenticated_user)

    return Response(get_registration_result_json(new_user))
