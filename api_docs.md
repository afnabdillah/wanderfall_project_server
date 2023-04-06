# API DOCS FOR WANDER FALL PROJECT

## API LIST

## User Routes
1. POST /signup
2. POST /login
3. POST /google-sign-in
4. GET /profile
5. PUT /profile

## Destination Routes
6. GET /destinations
7. GET /destinations/tags
8. POST /destinations/:destinationId
9. POST /destinations/:destinationId/reviews
10. POST /destinations/:destinationId/schedules
11. PUT /destinations/:destinationId/reviews/:reviewId
12. DELETE /destinations/:destinationId/reviews/:reviewId

## Schedule Routes
13. GET /schedules
14. PUT /schedules/:scheduleId
15. DELETE /schedules/:scheduleId

# API DESCRIPTION

## User Routes

## POST /signup

Request : 
* body
```json
{
  "email" : "string (required)",
  "username" : "string, (required, unique)",
  "password" : "string (required, minimun 5 characters)",
}
```

Response (201 - Created) :
```json
{
    "id": 22,
    "username": "afn200",
    "email": "afn200@mail.com",
    "password": "$2a$10$XqpK4aZyDgY3gOOgYSdHT.bbjskeyknzqhDrESyY53r7rJcntienW",
    "updatedAt": "2023-04-05T21:28:21.761Z",
    "createdAt": "2023-04-05T21:28:21.761Z",
    "type": "normal"
}
```

Response (400 - Bad Request) :
```json
{
    "message": "Username cannot be empty"
}
OR
{
    "message": "Username cannot be null"
}
OR
{
    "message": "This username is already taken"
}
OR
{
    "message": "Email cannot be empty"
}
OR
{
    "message": "Email cannot be null"
}
OR
{
    "message": "Email must be in email format"
}
OR
{
    "message": "Password cannot be null"
}
OR
{
    "message": "Minimum password length is 5"
}
```


## POST /login
* body
```json
{
  "email" : "string (required)",
  "password" : "string (required, minimun 5 characters)",
}
```

Response (200 - OK) :
```json
{
    "access_token": "string",
    "username": "string"
}
```

Response (401 - Bad Request) :
```json
{
    "message": "Wrong Email/Password"
}
```

## POST /google-sign-in
Request
* headers :
```json
{
  "credential" : "string"
}
```

Response (200 - OK)
```json
{
    "access_token": "string",
    "username": "string"
}
```

## GET /profile
Request
* headers :
```json
{
  "access_token" : "string"
}
```

Response (200 - OK) :
```json
{
    "id": 3,
    "fullName": "Super Master Nafa Lahabdi",
    "address": "Jakarta Bawah Laut",
    "phoneNumber": "12345678",
    "city": "Jekardah",
    "country": "Indonistan",
    "UserId": 3,
    "userPhoto": "https://randomuser.me/api/portraits/men/69.jpg",
    "createdAt": "2023-04-04T14:08:36.687Z",
    "updatedAt": "2023-04-04T22:19:46.048Z"
}
```

## PUT /profile

Requset
* headers :
```json
{
  "access_token" : "string"
}
```
* body
```json
{
    "fullName": "string",
    "address": "string",
    "phoneNumber": "string",
    "city": "string",
    "country": "string",
    "userPhoto": "string",
}
```

Response (200 - OK) : 
```json
{
    "message": "Your Profile Has Been Updated!"
}
```

## Destination Routes

## GET /destinations

Response (200 - OK) :
```json
{
    "destinations": [
        {
            "id": 1,
            "name": "Candi Borobudur",
            "address": "Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Kec. Borobudur, Kab. Magelang, Jawa Tengah",
            "city": "Magelang",
            "country": "Indonesia",
            "price": 48000,
            "openTime": "07:00:00",
            "closeTime": "15:00:00",
            "description": "Candi Borobudur adalah sebuah candi Buddha yang terletak di Borobudur, Magelang, Jawa Tengah, Indonesia. Candi ini terletak kurang lebih 100 km di sebelah barat daya Semarang, 86 km di sebelah barat Surakarta, dan 40 km di sebelah barat laut Yogyakarta.",
            "latitude": -7.607650472181044,
            "longitude": 110.20368692412788,
            "googlePlaceId": "ChIJl9anCfCMei4Ry8NNdDRD0w0",
            "createdAt": "2023-04-04T14:08:36.676Z",
            "updatedAt": "2023-04-04T14:08:36.676Z",
            "Images": [
                {
                    "id": 1,
                    "imgUrl": "https://i.ibb.co/4jSK7ps/borobudur-temple.jpg",
                    "DestinationId": 1,
                    "createdAt": "2023-04-04T14:08:36.701Z",
                    "updatedAt": "2023-04-04T14:08:36.701Z"
                }
                ...
            ],
            "Reviews": [
                {
                    "id": 4,
                    "UserId": 3,
                    "DestinationId": 1,
                    "review": "Candi Borobudur jadi  gila sekarnag keren banget sumpah",
                    "rating": 5,
                    "visitDate": "2023-04-01T00:00:00.000Z",
                    "createdAt": "2023-04-05T02:43:52.647Z",
                    "updatedAt": "2023-04-05T08:24:29.033Z"
                }
                ...
            ],
            "Tags": [
                {
                    "id": 8,
                    "name": "Situs Bersejarah",
                    "createdAt": "2023-04-04T14:08:36.694Z",
                    "updatedAt": "2023-04-04T14:08:36.694Z",
                    "DestinationTags": {
                        "DestinationId": 1,
                        "TagId": 8,
                        "createdAt": "2023-04-04T14:08:36.709Z",
                        "updatedAt": "2023-04-04T14:08:36.709Z"
                    }
                }
                ...
            ]
        },
        ...
    ]
}
```


## GET /destinations/tags

Response (200 - OK) :
```json
[
    {
        "id": 1,
        "name": "Kuil"
    },
    {
        "id": 2,
        "name": "Museum"
    }
    ...
]
```

## GET /destinations/:destinationId

Response (200 - OK) :
```json
{
    "id": 1,
    "name": "Candi Borobudur",
    "address": "Jl. Badrawati, Kw. Candi Borobudur, Borobudur, Kec. Borobudur, Kab. Magelang, Jawa Tengah",
    "city": "Magelang",
    "country": "Indonesia",
    "price": 48000,
    "openTime": "07:00:00",
    "closeTime": "15:00:00",
    "description": "Candi Borobudur adalah sebuah candi Buddha yang terletak di Borobudur, Magelang, Jawa Tengah, Indonesia. Candi ini terletak kurang lebih 100 km di sebelah barat daya Semarang, 86 km di sebelah barat Surakarta, dan 40 km di sebelah barat laut Yogyakarta.",
    "latitude": -7.607650472181044,
    "longitude": 110.20368692412788,
    "Images": [
        {
            "id": 1,
            "imgUrl": "https://i.ibb.co/4jSK7ps/borobudur-temple.jpg",
            "DestinationId": 1,
            "createdAt": "2023-04-04T14:08:36.701Z",
            "updatedAt": "2023-04-04T14:08:36.701Z"
        }
        ...
    ],
    "Reviews": [
        {
            "id": 4,
            "UserId": 3,
            "DestinationId": 1,
            "review": "Candi Borobudur jadi  gila sekarnag keren banget sumpah",
            "rating": 5,
            "visitDate": "2023-04-01T00:00:00.000Z",
            "User": {
                "id": 3,
                "username": "openAI",
                "email": "afn3@mail.com",
                "type": "normal",
                "Profile": {
                    "userPhoto": "https://randomuser.me/api/portraits/men/69.jpg"
                }
            }
        }
    ],
    "Tags": [
        {
            "id": 1,
            "name": "Kuil",
            "createdAt": "2023-04-04T14:08:36.694Z",
            "updatedAt": "2023-04-04T14:08:36.694Z",
            "DestinationTags": {
                "DestinationId": 1,
                "TagId": 1,
                "createdAt": "2023-04-04T14:08:36.709Z",
                "updatedAt": "2023-04-04T14:08:36.709Z"
            }
        },
        ...
    ],
    "photoAttributes": [
        {
            "height": 485,
            "html_attributions": [
                "<a href=\"https://maps.google.com/maps/contrib/104876800871963172731\">Abdillah Bramaywa Ahmad Manudipta</a>"
            ],
            "photo_reference": "AUjq9jk6mGlmOgauzVXu1vKFV0su8h-jVDyCvIGsK_WL293qModilREjsaypc2ESpnvRPEgFYabY8u31A-eyj2rR40iDAESe2FcA6UbgJf2Sw6P0cYbjIJmTqamY4Q-sBAn9Wbwtmdlm2lzE6IYUeAksmr51leg9jqWgLyCZM9LtM0d1gtp1",
            "width": 720
        }
        ...
    ]
}
```

Response (404 - Not Found) :
```json
{
    "message": "Data Not Found"
}
```

## POST /destinations/:destinationId/reviews

Request
* headers
```json
{
  "access_token" : "string"
}
```
* body
```json
{
  "review" : "string (required, minimum 10 characters and maximum 250 characters)",
  "visitDate" : "date",
  "rating" : "integer"
}
```

Response (201 - Created) :
```json
{
    "newReview": {
        "id": 9,
        "review": "gila lah emang nih tempat gila bener, air terjunnya mantab bro!!!",
        "rating": 5,
        "visitDate": "2023-12-12T00:00:00.000Z",
        "UserId": 3,
        "DestinationId": 3,
        "updatedAt": "2023-04-05T21:49:17.769Z",
        "createdAt": "2023-04-05T21:49:17.769Z"
    },
    "message": "Post Review Success!"
}
```

Response (400 - Bad Request) :
```json
{
    "message": "Review length must be between 10 and 250 characters"
}
```

Response (404 - Not Found) :
```json
{
    "message": "Data Not Found"
}
```

## POST /destinations/:destinationId/schedules

Request
* headers
```json
{
  "access_token" : "string"
}
```
* body
```json
{
  "plan" : "string",
  "scheduleDate" : "string (required, minimum today)",
  "scheduleTime" : "string",
  "scheduleEnd" : "string",
  "isSyncWithGoogleCalendar" : "boolean"
}
```

Response (201 - Created) :
```json
{
    "id": 8,
    "plan": "I'm going there on 13 April!!",
    "scheduleDate": "2023-04-13T00:00:00.000Z",
    "scheduleTime": "06:00:00",
    "scheduleEnd": "09:00:00",
    "isSyncWithGoogleCalendar": true,
    "DestinationId": 5,
    "UserId": 3,
    "eventId": "tlunuf0920curfdg4hkq78i33g",
    "link": "https://www.google.com/calendar/event?eid=dGx1bnVmMDkyMGN1cmZkZzRoa3E3OGkzM2cgYWZuYWJkaWxsYWhAbQ",
    "updatedAt": "2023-04-05T21:56:09.232Z",
    "createdAt": "2023-04-05T21:56:09.232Z"
}
```
Response (400 - Bad Request) :
```json
{
    "message": "Cannot set date before today"
}
```

Response (404 - Not Found) :
```json
{
    "message": "Data Not Found"
}
```

## PUT /destinations/:destinationId/reviews/:reviewId

Request 
* headers
```json
{
  "access_token" : "string"
}
```
* body
```json
{
  "review" : "string (required, minimum 10 characters and maximum 250 characters)",
  "visitDate" : "date",
  "rating" : "integer"
}
```

Response (200 - OK) :
```json
{
    "message": "Update Review Success!"
}
```

Response (404 - Not Found) :
```json
{
    "message": "Data Not Found"
}
```

## DELETE /destinations/:destinationId/reviews/:reviewId
Request 
* headers
```json
{
  "access_token" : "string"
}
```

Response (200 - OK)
```json
{
    "review": {
        "id": 13,
        "UserId": 3,
        "DestinationId": 3,
        "review": "gila lah emang nih tempat gila bener, air terjunnya mantab bro!!!",
        "rating": 5,
        "visitDate": "2024-12-12T00:00:00.000Z",
        "createdAt": "2023-04-05T22:05:26.084Z",
        "updatedAt": "2023-04-05T22:05:26.084Z"
    },
    "message": "Delete review success!"
}
```

Response (404 - Not Found)
```json
{
    "message": "Data Not Found"
}
```

## Schedule Routes

## GET /schedules
Request 
* headers
```json
{
  "access_token" : "string"
}
```

Response (200 - OK) :
```json
[
    {
        "id": 3,
        "UserId": 3,
        "DestinationId": 4,
        "scheduleDate": "2023-04-06T00:00:00.000Z",
        "scheduleTime": "09:00:00",
        "scheduleEnd": "12:00:00",
        "eventId": null,
        "link": null,
        "isSyncWithGoogleCalendar": true,
        "plan": "Aku mau main ke sini nanti pas udah gede nanti!!!",
        "createdAt": "2023-04-05T06:05:29.216Z",
        "updatedAt": "2023-04-05T12:51:07.766Z",
        "Destination": {
            "id": 4,
            "name": "Museum Kota Lama",
            "address": "Jl. Cendrawasih No.1a, Purwodinatan, Kec. Semarang Tengah, Kota Semarang, Jawa Tengah",
            "city": "Semarang",
            "country": "Indonesia",
            "price": 0,
            "openTime": "09:00:00",
            "closeTime": "15:00:00",
            "description": "Museum Kota Lama Semarang berdiri di atas lokasi yang dulunya merupakan air mancur Bundara Bubakan Semarang. Tempat wisata ini menampilakan sejarah Kota Semarang mulai tahun 1547 saat kota tersebut berdiri, khususnya perkembangan dan pertumbuhan kota ini.",
            "latitude": -6.9693571533143395,
            "longitude": 110.43068906829924,
            "googlePlaceId": "ChIJNQOtDETzcC4RnOp9ejrKX-s",
            "createdAt": "2023-04-04T14:08:36.676Z",
            "updatedAt": "2023-04-04T14:08:36.676Z"
        }
    },
    ...
]
```

## PUT /schedules/:scheduleId

Request 
* headers
```json
{
  "access_token" : "string"
}
```
* body
```json
{
  "plan" : "string",
  "scheduleDate" : "string",
  "scheduleTime" : "string",
  "scheduleEnd" : "string",
  "isSyncWithGoogleCalendar" : "boolean"
}
```

Response (200 - OK) :
```json
{
    "updatedSchedule": {
        "id": 2,
        "UserId": 3,
        "DestinationId": 5,
        "scheduleDate": "2023-04-09T00:00:00.000Z",
        "scheduleTime": "09:00:00",
        "scheduleEnd": "12:00:00",
        "eventId": "7ueo2jqa0jiuqmht4th0uf4c4o",
        "link": "https://www.google.com/calendar/event?eid=N3VlbzJqcWEwaml1cW1odDR0aDB1ZjRjNG8gYWZuYWJkaWxsYWhAbQ",
        "isSyncWithGoogleCalendar": true,
        "plan": "superrrrrr superrrrrrrr",
        "createdAt": "2023-04-05T02:05:42.896Z",
        "updatedAt": "2023-04-05T22:09:45.345Z"
    }
}
```

Response (403 - Forbidden) :
```json
{
    "message": "You are forbidden to do this action"
}
```

## DELETE /schedules/:scheduleId

Request 
* headers
```json
{
  "access_token" : "string"
}
```

Response (200 - OK) :
```json
{
    "schedule": {
        "id": 2,
        "UserId": 3,
        "DestinationId": 5,
        "scheduleDate": "2023-04-09T00:00:00.000Z",
        "scheduleTime": "09:00:00",
        "scheduleEnd": "12:00:00",
        "eventId": "7ueo2jqa0jiuqmht4th0uf4c4o",
        "link": "https://www.google.com/calendar/event?eid=N3VlbzJqcWEwaml1cW1odDR0aDB1ZjRjNG8gYWZuYWJkaWxsYWhAbQ",
        "isSyncWithGoogleCalendar": true,
        "plan": "superrrrrr superrrrrrrr",
        "createdAt": "2023-04-05T02:05:42.896Z",
        "updatedAt": "2023-04-05T22:09:45.345Z"
    }
}
```

Response (403 - Forbidden) :
```json
{
    "message": "You are forbidden to do this action"
}
```

Response (404 - Not Found) :
```json
{
    "message": "Data Not Found"
}
```

## Global Errors

Response (500 - Internal Server Error) :
```json
{
    "message": "Internal Server Error"
}
```