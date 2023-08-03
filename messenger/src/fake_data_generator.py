import random
from faker import Faker
from datetime import datetime, timedelta
import json

# Function to generate a random list of notifications
def generate_notifications():
    fake = Faker()
    notifications = []
    for _ in range(20):
        title = fake.sentence()
        body = fake.paragraph()
        created_at = datetime.now() - timedelta(days=random.randint(0, 30))  # Notifications sent in the last 30 days
        notification = {
            "type": 0,
            "to": "afx",
            "content": {
                "title": title,
                "body": body
            },
            "created_at": created_at.isoformat()
        }
        notifications.append(notification)
    return notifications

# Generate the fake notifications
fake_notifications = generate_notifications()

print(fake_notifications)


