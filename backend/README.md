# v3 backend

## Current Algorithm

- Fetch repository resources
  - records.yaml
    - Contains all map ids and wrs
  - overrides.yaml
    - Used to replace invalid scores by legit players
  - community.yaml
    - Used to generate video showcases
- Fetch 5'000 scores for each map
  - Each score will be saved into the player file
  - Use chunks of 1000 entries + multi-threading
    - Ignore banned players
    - Ignore invalid scores
      - Replace invalid score if an override exists
  - Fetch next 5'000 in special cases
    - Map record equals last record of page
    - Map record is limited because of many ties
  - Last fetched page except the first will be sliced based on the record/limit
- At this point we only want players who finished all maps of any campaign
  - Merge all player ids from *Portal Gun* and *Doors*
    - Does not have to iterate through 200'0000 players
    - Saves a lot of time since we only have to go through 10'000 files in the worst case
  - Iterate over every score of each player and sum the total score count of each campaign
    - Ignore banned players
    - Keep track of how many maps have been completed for each campaign
    - Ignore player if the number of completed maps has not been satisfied
- At this point filtering happened and it is time to resolve the player name, avatar and country
  - Slice player ids into a chunk of 100
  - Each chunk requires an api call
  - Save new data
  - Create and export api profiles
- Calculate final rankings and export
- Create records api endpoint

Further improvements can be made by not converting everything into api objects. Some things like ranking could be calculated at client side in the application. But for the moment this would be a breaking change and would also require additional work.
