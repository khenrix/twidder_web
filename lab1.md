# Lab 1 - Questions for consideration

1. *Why do we validate data before sending it to the server at client-side, as opposed to just letting the server validate data before using it? What we get and what we lose by it?* 

By validating data before sending it to server we let the server do all the work instead of doing unneccesary work on the server. 
All though you still need to validate certain data in the back-end for security reasons. 
Ex: Format of input can be checked in frontend while validation of data is done by the server. 

2. *How secure is the system using an access token to authenticate? Is there any way to circumvent it and get access to private data?* 

The token is somewhat secure assuming someone does not get hold of the token. 
Well you could access private data by getting the token, through guessing if the token is easily formated. 

3. *What would happen if a user were to post a message containing JavaScript-code? Would the code be executed? How can it oppose a threat to the system? What would the counter measure?* 

The user would inject code into the system and the code would be executed if the system has not taken any preventions. 
It opposes as a threat in the way that an attacker can inject code that other users run without knowing it. 
A counter measure would be to not allow JavaScript code in post requests. 

4. *What happens when we use the back/forward buttons while working with Twidder? Is this the expected behaviour? Why are we getting this behaviour? What would be the solution?* 

We exit Twidder. This is not the exepected behaviour for a single-page website. 
We are getting this behaviour since this is how normal pages work. 

5. *What happens when the user refreshes the page while working with Twidder? Is this the expected behaviour? Why are we getting this behaviour?* 

It stays the same. Yes, this is expected? 

6.* Is it a good idea to read views from the server instead of embedding them inside of the “client.html”? What are the advantages and disadvantages of it comparing to the current approach?* 

Client side has lower bandwith usage but Server side has faster browser rendering in general. 

7. *Is it a good idea to return true or false to state if an operation has gone wrong at the server-side or not? How can it be improved?* 

It's not a bad idea, but not the optimal one. A better way would be to return some kind of error message / error id when an operation has gone wrong. 

8. *Is it reliable to perform data validation at client-side? If so please explain how and if not what would be the solution to improve it?* 

No, it's not reliable. You should also validate data on the server. 

9. *Why isn’t it a good idea to use tables for layout purposes? What would be the replacement?* 

Tables are not that flexible. Using CSS is better. (Advantages CSS: Easier Site-Wide Changes, Faster Load Times Because of Lighter Code, Separation of Style and Content) 

10. *How do you think Single Page Applications can contribute to the future of the web? What is their advantages and disadvantages from usage and development point of views?* 

Websites which require more interaction with the user (as Gmail) tend to be better as SPA:s, while blogs as an example do not and are better suited as MPA:s. 
Not a big fan of SPAs.