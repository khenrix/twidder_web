# LAB 2 Questions
**1.) What security risks can storing passwords in plain text cause? How can this problem be addressed programmatically?** 

If someone gets hold of the database they will get hold of all the passwords in plain text.
A solution might be hashing the password with a salt.

**2) As http requests and responses are text-based information, they can be easily intercepted and read by a third-party on the Internet. Please explain how this problem has been solved in real-world scenarios.** 

Only appropriate users with special permission can get reading access. We use a token system, which the real-world scenarios probably also do.

**3) How can we use Flask for implementing multi-page web applications? Please explain how Flask templates can help us on the way?** 

By rendering different html templates for different routings.

**4) Please describe a Database Management System. How SQLite is different from other DBMSs?** 

A dbms is a technology to store and retrieve data in an efficient way. The entire database consists of a single file on the disk.

**5) Do you think the Telnet client is a good tool for testing server-side procedures? What are its possible shortages?** 

Yes, but because everything is sent as plain text we might have some security issues.
