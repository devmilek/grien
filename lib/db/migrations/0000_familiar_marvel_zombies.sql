CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` varchar(2048),
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `attributes_to_recipes` (
	`recipe_id` int NOT NULL,
	`attribute_id` int NOT NULL,
	CONSTRAINT `attributes_to_recipes_recipe_id_attribute_id_pk` PRIMARY KEY(`recipe_id`,`attribute_id`)
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`image` varchar(500),
	CONSTRAINT `category_id` PRIMARY KEY(`id`),
	CONSTRAINT `category_name_unique` UNIQUE(`name`),
	CONSTRAINT `category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `ingredient` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quantity` smallint,
	`unit` varchar(50),
	`name` varchar(256) NOT NULL,
	`recipe_id` int NOT NULL,
	CONSTRAINT `ingredient_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preparation_step` (
	`id` mediumint AUTO_INCREMENT NOT NULL,
	`recipe_id` int NOT NULL,
	`description` text NOT NULL,
	`position` tinyint NOT NULL,
	`image_url` varchar(500),
	CONSTRAINT `preparation_step_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recipe` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` tinytext NOT NULL,
	`slug` varchar(256) NOT NULL,
	`description` text NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'easy',
	`preparation_time` int NOT NULL,
	`published` boolean NOT NULL DEFAULT false,
	`servings` tinyint NOT NULL,
	`category_id` int NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `recipe_id` PRIMARY KEY(`id`),
	CONSTRAINT `recipe_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `recipe_attribute` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`slug` varchar(256) NOT NULL,
	`type` enum('occasion','cuisine','diet') NOT NULL,
	CONSTRAINT `recipe_attribute_id` PRIMARY KEY(`id`),
	CONSTRAINT `recipe_attribute_name_unique` UNIQUE(`name`),
	CONSTRAINT `recipe_attribute_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`image` varchar(255),
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attributes_to_recipes` ADD CONSTRAINT `attributes_to_recipes_recipe_id_recipe_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attributes_to_recipes` ADD CONSTRAINT `attributes_to_recipes_attribute_id_recipe_attribute_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `recipe_attribute`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;