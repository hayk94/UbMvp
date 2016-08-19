**MVP GOALS**
- [v] Get a list of users who attended the site.
- [v] See what links,buttons the user clicked.
- [ ] See what pages they attended and their order as a timeline.
- [ ] If the user is online see at what page he's now.


**FIRST FEATURE**

- [ V ] Get a list of users who attended the site.
    - [ V ] Create a db with IPs saved there as if users
        - [ V ] on new connection check if there is already such ip registered
            - [ V ] if yes then put all the connections under it
          - [  ] Create a db to save online connections
              - [  ] onClose remove the connection from this db
                      *Let this be duplicate of the first db just remove the ones that has disconnectedAt or even simpler probably there is a way in monogoDb to filter them*
                      *I think there is no need for this now, since if the connection has no disconnectedAt then it means it is online,* **HOWEVER consider for later that when the server is being restarted and there are active connections they do not get disconnectedAt value**
- [ V ] Print the info in the template

**SECOND FEATURE**

- [v] See what links,buttons the user clicked.
      - [v] body template events * clicks
          - [v] stopPropagation
          - [v] send to db
      <!-- *Got the click events in the db just now need to properly render them in templates* -->
- [v] The ips are wrong

*PROPER RENDERING*
  - [v] Proper Render
