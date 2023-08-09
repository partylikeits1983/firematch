# Firematch

pnpm run dev

npx prettier --write "src/**/*.ts"


## BOT father commands
```
start - Start the bot
match - Get sent matches
users - Get help
data - Get analytics
help - Get help

```


# SQL table

```
CREATE TABLE users (
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    gender VARCHAR(50) NOT NULL,
    preference VARCHAR(50) NOT NULL,
    subscription VARCHAR(255) NOT NULL,
    sign_up_date BIGINT NOT NULL, -- UNIX timestamp
    last_active BIGINT NOT NULL,  -- UNIX timestamp
    photo_ids TEXT[] DEFAULT '{}', -- Array of strings
    likes INT[] DEFAULT '{}',     -- Array of integers
    geolocation POINT             -- Using the POINT type for geolocation
);
```