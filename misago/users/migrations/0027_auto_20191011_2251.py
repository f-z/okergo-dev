# Generated by Django 2.2.3 on 2019-10-11 22:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('misago_users', '0026_auto_20191002_2141'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='specialization',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(db_index=True, default=True, help_text='Καταδεικνύει εάν ο χρήστης είναι ενεργός. Η αποενεργοποίηση είναι προτιμητέα της διαγραφής.', verbose_name='ενεργός'),
        ),
        migrations.AlterField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False, help_text='Καταδεικνύει εάν ο χρήστης μπορεί να συνδεθεί στον πίνακα διαχείρισης', verbose_name='μέλος ομάδας Ok Ergo'),
        ),
        migrations.AlterField(
            model_name='user',
            name='joined_on',
            field=models.DateTimeField(db_index=True, default=django.utils.timezone.now, verbose_name='έγινε μέλος'),
        ),
        migrations.AlterField(
            model_name='user',
            name='limits_private_thread_invites_to',
            field=models.PositiveIntegerField(choices=[(0, 'Όλοι'), (1, 'Μόνο χρήστες που ακολουθώ'), (2, 'Κανένας')], default=0),
        ),
        migrations.AlterField(
            model_name='user',
            name='subscribe_to_replied_threads',
            field=models.PositiveIntegerField(choices=[(0, 'Καμία ειδοποίηση'), (1, 'Ειδοποίηση στη σελίδα'), (2, 'Ειδοποίηση μέσω email')], default=2),
        ),
        migrations.AlterField(
            model_name='user',
            name='subscribe_to_started_threads',
            field=models.PositiveIntegerField(choices=[(0, 'Καμία ειδοποίηση'), (1, 'Ειδοποίηση στη σελίδα'), (2, 'Ειδοποίηση μέσω email')], default=2),
        ),
    ]
