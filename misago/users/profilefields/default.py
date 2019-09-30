import re

from django.forms import ValidationError
from django.utils.translation import gettext
from django.utils.translation import gettext_lazy as _

from . import basefields


class BioField(basefields.UrlifiedTextareaProfileField):
    fieldname = "bio"
    label = _("Πληροφορίες")


class RealNameField(basefields.TextProfileField):
    fieldname = "real_name"
    label = _("Ονοματεπώνυμο")


class RegionField(basefields.TextProfileField):
    fieldname = "region"
    label = _("Νομός")


class IsEngineerField(basefields.ChoiceProfileField):
    fieldname = "is_engineer"
    label = _("Μηχανικός")

    choices = (
        ("customer", _("Ιδιώτης")),
        ("engineer", _("Μηχανικός")),
    )


class WebsiteField(basefields.UrlProfileField):
    fieldname = "website"
    label = _("Ιστοσελίδα")
    help_text = _(
        "Εάν έχεις δικιά σου ιστοσελίδα μπορείς να την προωθήσεις εδώ. "
        'Για να είναι έγκυρη η διεύθυνση πρέπει να ξεκινάει με "http://" ή "https://".'
    )


class PhoneNumberField(basefields.TextProfileField):
    fieldname = "phone"
    label = _("Τηλέφωνο")

    def get_help_text(self, user):
        return _(
            "Βάλε το τηλέφωνό σου εδώ, για να μπορούν να επικοινωνούν "
            "οι άλλοι χρήστες μαζί σου για δουλειές μέσω τηλεφώνου. "
            "Πρέπει να είναι ελληνικό νούμερο, "
            "να έχει δέκα ακριβώς ψηφία "
            "και να ΜΗ βάλεις τον κωδικό χώρας (+30)."
        )

    def get_value_display_data(self, request, user, value):
        return {"text": "+30%s" % value, "url": "tel:+30%s" % value}

    def clean(self, request, user, data):
        if data and (not re.search("^\d*$", data) or data.length != 10):
            raise ValidationError(gettext("Ο αριθμός τηλεφώνου δεν είναι έγκυρος!"))
        return data


class JoinIpField(basefields.TextProfileField):
    fieldname = "join_ip"
    label = _("IP εγγραφής")
    readonly = True

    def get_value_display_data(self, request, user, value):
        if not request.user_acl.get("can_see_users_ips"):
            return None

        if not user.joined_from_ip:
            return None

        return {"text": user.joined_from_ip}
