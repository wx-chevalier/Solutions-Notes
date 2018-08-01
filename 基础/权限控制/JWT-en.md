# JSON Web Token

As specs from [openid](https://openid.net/specs/draft-jones-json-web-token-07.html), JSON Web Token (JWT) is a means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is digitally signed using JSON Web Signature (JWS) and/or encrypted using JSON Web Encryption (JWE).

# Parts

![](https://cdn-images-1.medium.com/max/1600/1*0SEbHdFcVpaejejGA-1DDw.png)

## Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- alg: We have two main algorithms(HS256/RS256) to sign our JWT 3rd part (Signature) which we mention in the headers so that the producer and consumer(you will understand this soon in the next section) both should use the same algorithm to verify the token on each end. HS256 indicates that this token is signed using HMAC-SHA256.

* typ: Define the type of the token which is JWT obviously in our case.

When we base64UrlEncode the above header data we will get eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 the first part of our JWT token.

## Payload

It mostly contains the claims (custom data) and some standard claims as well. We can use standard claims to identify a lot of things i.e `*exp: the expiry of the token*`_,_`*iat: time at which token issued*`_ etc._

```
{
 "email": "John Doe",
 "xyz": "abc"
}
```

When we **base64UrlEncode** the above payload data we will get \*eyJuYW1lIjoiSm9obiBEb2UiLCJhbW91bnQiOjUwMCwieHl6IjoiYWJjIn0**\* **the second part of our JWT token.

**Following are some standard claims: **[Wikipedia](https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields)

> Issuer (`iss`) - identifies principal that issued the JWT;

> Subject (`sub`) - identifies the subject of the JWT;

> Audience (`aud`) - The "aud" (audience) claim identifies the recipients that the JWT is intended for. Each principal intended to process the JWT **must** identify itself with a value in the audience claim. If the principal processing the claim does not identify itself with a value in the `aud` claim when this claim is present, then the JWT **must** be rejected.

> Expiration time (`exp`) - The "exp" (expiration time) claim identifies the expiration time on or after which the JWT **must not** be accepted for processing. The value should be in NumericDate[10][11] format.

> Not before (`nbf`) - Similarly, the not-before time claim identifies the time on which the JWT will start to be accepted for processing.

> Issued at (`iat`) - The "iat" (issued at) claim identifies the time at which the JWT was issued.

> JWT ID (`jti`) - case sensitive unique identifier of the token even among different issuers.

## Signature

It is calculated by base64url encoding of header and payload and concatenating them with a period as a separator. Then encrypt it with HMAC-SHA256 along with the secret key and the result of the first step.

```
key           = 'secretkey';
unsignedToken = encodeBase64Url(header) + '.' + encodeBase64Url(payload);
signature     = HMAC-SHA256(key, unsignedToken) // As mentioned in header section.
```

# Processing

![](https://cdn-images-1.medium.com/max/1600/1*44waelPu4JvYALzkvoh8zw.png)

- Producer is the one who gives a service. It will be the provider(Server) of the API(s) which are JWT protected.

- Consumer is the one who uses it. It will be the customer(Server/Mobile App/ Web App/ Client) who will be providing the valid JWT token to consume the API(s) being provided by the Producer.

In server 2 server authentication both the parties need to share the custom contract for specific API based or for all the API(s). This contract can consist of any custom clause that you want to introduce. For example here is the below custom contract that we will be using for our example

1.** Share the SECRET: **This is the responsibility of the Producer side to share the mutual secret. This secret will be required to verify the token at the Producer end and the same secret will be used to create the token at the respective consumer side.

2.** Prepare the PAYLOAD: **Consumer should encode all the data (body or query or params) in the payload of the JWT token (you can choose specific fields that need to be present in the payload of JWT but I would suggest to wrap all the data). We will exact this at producer end to verify that the data is the same in the token payload and the request API.
i.e: GET call to `/v1/api/getdetails?email=rachitgulati26@gmail.com` should have JWT payload

```json
{
  "email": "rachitgulati26@gmail.com"
}
```

and the request.query is also the same as above.

3.  **GET the TOKEN: **The token should be present in the header with name **jwt-token \***(you can choose your custom name or send it in authorization header after all it’s custom contract).**\* **[Also, the best practice is to send it via Authorization Bearer scheme.](https://stackoverflow.com/questions/33265812/best-http-authorization-header-type-for-jwt)

> The best HTTP header for your client to send an access token (JWT or any other token) is the `Authorization` header with the `Bearer` authentication scheme.

4.** Idenitify the CONSUMER:** We just need one last thing and that is to identify our consumer. This we can do it in either way by setting `*iss: CONSUMER_NAME*`\* standard claim in the payload or by sending another header **\*jwt-consumer: CONSUMER_NAME. **We will be using the latter one.
