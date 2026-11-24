CREATE TABLE announcement (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(150)  NOT NULL,
    summary      VARCHAR(300)  NOT NULL,
    body         VARCHAR(5000) NOT NULL,
    category     VARCHAR(20)   NOT NULL,
    published_at DATE          NOT NULL,
    pinned       BOOLEAN       NOT NULL DEFAULT FALSE,
    published    BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP(6)  NOT NULL,
    updated_at   TIMESTAMP(6)  NOT NULL
);

CREATE INDEX idx_announcement_public ON announcement (published, published_at);

CREATE TABLE contact_message (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL,
    phone      VARCHAR(30),
    subject    VARCHAR(50)   NOT NULL,
    message    VARCHAR(2000) NOT NULL,
    consent    BOOLEAN       NOT NULL,
    is_read    BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6)  NOT NULL
);

CREATE TABLE admin_user (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP(6) NOT NULL
);
