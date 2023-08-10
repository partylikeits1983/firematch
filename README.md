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
    user_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    username VARCHAR(255),
    gender VARCHAR(50),
    age INT,
    preference VARCHAR(50),
    subscription VARCHAR(255),
    sign_up_date BIGINT, -- UNIX timestamp
    last_active BIGINT,  -- UNIX timestamp
    photo_ids TEXT[] DEFAULT '{}', -- Array of strings
    likes INT[] DEFAULT '{}',     -- Array of integers
    share_location BOOL,
    geolocation VARCHAR(255),
    bio TEXT
);
```