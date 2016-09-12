**- [ ] HUBSPOT contact API**
        - [v] Get UTK
        - [v] Sent UTK to my server and add to the DB
              - [v] Add the UTK, first name,last name,email fields in the initial DB creation in the server *OR RESEARCH HOW TO ADD NEW FIELDS AFTER THE DB CREATION*
        - [v] Sent a http GET request to HUBSPOT from METEOR to get the contact by UTK
        - [v] Store some contact info (aka first name, last name, email) in the DB
        - [ ] If UTK already exists in our DB show its info
**- [v] HUBSPOT INTEGRATION**
        - [v] establish DDP connection
        - [v] Get the click events
        - [v] Get the history
**MVP GOALS**
- [v] Get a list of users who attended the site.
- [v] See what links,buttons the user clicked.
- [v] See what pages they attended and their order as a timeline.
- [v] If the user is online see at what page he's now.

**FIRST FEATURE**

- [ V ] Get a list of users who attended the site.
    - [ V ] Create a db with IPs saved there as if users
        - [ V ] on new connection check if there is already such ip registered
            - [ V ] if yes then put all the connections under it
          <!-- - [  ] Create a db to save online connections -->
              <!-- - [  ] onClose remove the connection from this db -->
                      *Let this be duplicate of the first db just remove the ones that has disconnectedAt or even simpler probably there is a way in mongoDb to filter them*
                      *I think there is no need for this now, since if the connection has no disconnectedAt then it means it is online,* **HOWEVER consider for later that when the server is being restarted and there are active connections they do not get disconnectedAt value**
- [ V ] Print the info in the template

**SECOND FEATURE**

- [v] See what links,buttons the user clicked.
      - [v] body template events * clicks
          - [v] stopPropagation
          - [v] send to db
      <!-- *Got the click events in the db just now need to properly render them in templates* -->
- [v] The ips are wrong
      **CONSIDER too many intensive clicks make the app die**

*PROPER RENDERING*
  - [v] Proper Render

*RESEARCH THE FLOW ROUTER*
    For the next 2 features we need a router so let's research it

    - [v] https://kadira.io/academy/meteor-routing-guide
    - [v] https://guide.meteor.com/routing.html
    - [v] test in nitrous


**THIRD FEATURE AND FOURTH FEATURE**

    - [v] See what pages they attended and their order as a timeline.
          - [v] Add new field for attended pages in the db when it being created
          <!-- - [ ] Add window.location.href to the db as the FlowRouter.route() is being executed -->

    - [v] add some more links
    - [v] Test in Nitrous io
