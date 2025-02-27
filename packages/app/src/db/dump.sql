PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		);
INSERT INTO __drizzle_migrations VALUES(NULL,'1a752bf66a3dde732aed301ec85b16ea2b513478eeceb3a5e61cbccaef459f49',1740345902809);
INSERT INTO __drizzle_migrations VALUES(NULL,'95ad1bdbb97c1c7b0728b40c0695fec00bf116712f1ab13a42b8c8974b2f88a9',1740500891549);
CREATE TABLE IF NOT EXISTS `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
INSERT INTO users VALUES(9,'ckafrouni@proton.me','Chris','2025-02-25 17:12:15','2025-02-25 17:12:15');
INSERT INTO users VALUES(10,'alex@test.com','Alex','2025-02-26 14:18:48','2025-02-26 14:18:48');
CREATE TABLE IF NOT EXISTS `password_auth` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO password_auth VALUES(9,'$2b$12$tkZss4TQgYW4SnUYVBoawuwZc4u7exxwBOy/Nz9.QO56.L2nuReDW','','2025-02-25 17:12:15','2025-02-25 17:12:15');
INSERT INTO password_auth VALUES(10,'$2b$12$3qAe84s/F.XrNvDhaAH7dOpRWnhVXEBrF5xpMfYXHI44TEBhUic6a','','2025-02-26 14:18:49','2025-02-26 14:18:49');
CREATE TABLE IF NOT EXISTS `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO sessions VALUES(15,9,'b0d9c63c8045f89508a96d69d3cb7df41d723740cdbcb1f3d46b5e9112cd98f3',1741181142370,NULL,NULL,'2025-02-26 13:25:42','2025-02-26 13:25:42');
INSERT INTO sessions VALUES(18,9,'e47a5c712df81e4729854555fbb2ef124a36f0a5d03974c5f147f1841d48499d',1741184220520,NULL,NULL,'2025-02-26 14:17:00','2025-02-26 14:17:00');
INSERT INTO sessions VALUES(22,10,'7e19b803593b13d35e0b03ec4d0990eb29ef4a48fc6efdd44d1bb1c387b7a0b4',1741184329258,NULL,NULL,'2025-02-26 14:18:49','2025-02-26 14:18:49');
INSERT INTO sessions VALUES(23,9,'880d84fbc845df1136c190ae0bf76a127507dfeb572788524972478509dbec97',1741283863416,NULL,NULL,'2025-02-27 17:57:43','2025-02-27 17:57:43');
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',10);
INSERT INTO sqlite_sequence VALUES('sessions',25);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);
COMMIT;
