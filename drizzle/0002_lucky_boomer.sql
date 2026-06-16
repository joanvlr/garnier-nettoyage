CREATE TABLE `quoteRequestNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`adminId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quoteRequestNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quoteRequests` ADD `notes` text;--> statement-breakpoint
ALTER TABLE `quoteRequests` ADD `archived` enum('0','1') DEFAULT '0' NOT NULL;