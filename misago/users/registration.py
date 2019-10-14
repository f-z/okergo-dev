from ..core.mail import mail_user
from ..legal.models import Agreement
from ..legal.utils import save_user_agreement_acceptance
from .tokens import make_activation_token
from ..conf import settings as static_settings
from django.contrib.auth import get_user_model

User = get_user_model()


def send_welcome_email(request, user):
    settings = request.settings

    mail_subject = "Καλωσήρθες στο %(forum_name)s!"
    mail_subject = mail_subject % {"forum_name": settings.forum_name}

    if not user.requires_activation:
        mail_user(
            user,
            mail_subject,
            "misago/emails/register/complete",
            context={"settings": settings},
        )
        return

    activation_token = make_activation_token(user)

    activation_by_admin = user.requires_activation_by_admin
    activation_by_user = user.requires_activation_by_user

    mail_user(
        user,
        mail_subject,
        "misago/emails/register/inactive",
        context={
            "activation_token": activation_token,
            "activation_by_admin": activation_by_admin,
            "activation_by_user": activation_by_user,
            "settings": settings,
        }
    )

    if activation_by_admin:
        admin = User.objects.get(pk = 1)

        mail_subject = "Ο χρήστης %(user_name)s έκανε εγγραφή και περιμένει ενεργοποίηση!"
        mail_subject = mail_subject % {"user_name": user.username}

        # Email admin too
        mail_user(
            admin,
            mail_subject,
            "misago/emails/base",
            context={
                "activation_token": activation_token,
                "activation_by_admin": activation_by_admin,
                "activation_by_user": activation_by_user,
                "settings": settings,
            }
    )


def save_user_agreements(user, form):
    if not form.agreements:
        return

    for field_name in form.agreements.keys():
        agreement_id = form.cleaned_data[field_name]
        agreement = Agreement.objects.get(id=agreement_id)
        save_user_agreement_acceptance(user, agreement)

    user.save(update_fields=["agreements"])


def get_registration_result_json(user):
    activation_method = "active"
    if user.requires_activation_by_admin:
        activation_method = "admin"
    elif user.requires_activation_by_user:
        activation_method = "user"

    return {
        "activation": activation_method,
        "email": user.email,
        "username": user.username,
    }
