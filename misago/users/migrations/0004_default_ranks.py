from django.db import migrations
from django.utils.translation import gettext

from ...core.utils import slugify


def _(s): return s


def create_default_ranks(apps, schema_editor):
    Rank = apps.get_model("misago_users", "Rank")

    team = Rank.objects.create(
        name="Διαχειριστές",
        slug=slugify("Διαχειριστές"),
        title="Μέλος ομάδας Ok Ergo",
        css_class="primary",
        is_tab=True,
        order=0,
    )

    engineers = Rank.objects.create(
        name="Μηχανικοί",
        slug=slugify("Μηχανικοί"),
        title="Μηχανικός",
        is_tab=True,
        order=1,
    )

    engineers_tee = Rank.objects.create(
        name="Μηχανικοί Τ.Ε.",
        slug=slugify("Μηχανικοί Τ.Ε."),
        title="Μηχανικός Τ.Ε.",
        is_tab=True,
        order=2,
    )

    customers = Rank.objects.create(
        name="Ιδιώτες",
        slug=slugify("Ιδιώτες"),
        title="Πελάτης",
        is_default=True,
        order=3,
    )

    Role = apps.get_model("misago_acl", "Role")

    team.roles.add(Role.objects.get(name="Διαχειριστής αγγελιών"))
    team.roles.add(Role.objects.get(name="Μπορεί να αποκλείει χρήστες"))
    team.roles.add(Role.objects.get(
        name="Διαχειριστής συνομιλιών για ανάθεση εργασίας"))

    engineers.roles.add(Role.objects.get(name="Μηχανικός"))
    engineers.roles.add(Role.objects.get(
        name="Ξεκίνημα συνομιλίας για ανάθεση εργασίας"))

    engineers_tee.roles.add(Role.objects.get(name="Μηχανικός"))
    engineers_tee.roles.add(Role.objects.get(
        name="Ξεκίνημα συνομιλίας για ανάθεση εργασίας"))

    customers.roles.add(Role.objects.get(name="Πελάτης"))
    customers.roles.add(Role.objects.get(
        name="Ξεκίνημα συνομιλίας για ανάθεση εργασίας"))


class Migration(migrations.Migration):

    dependencies = [
        ("misago_users", "0003_bans_version_tracker"),
        ("misago_acl", "0003_default_roles"),
    ]

    operations = [migrations.RunPython(create_default_ranks)]
