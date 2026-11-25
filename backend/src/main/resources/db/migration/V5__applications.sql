-- Online applications submitted from the Register page
CREATE TABLE application (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    child_first_name  VARCHAR(80)   NOT NULL,
    child_last_name   VARCHAR(80)   NOT NULL,
    child_birth_date  DATE          NOT NULL,
    grade             VARCHAR(20)   NOT NULL,
    start_year        INT           NOT NULL,
    previous_school   VARCHAR(150),
    parent_name       VARCHAR(100)  NOT NULL,
    relationship      VARCHAR(40)   NOT NULL,
    phone             VARCHAR(30)   NOT NULL,
    email             VARCHAR(150),
    address           VARCHAR(300),
    notes             VARCHAR(2000),
    consent           BOOLEAN       NOT NULL,
    status            VARCHAR(20)   NOT NULL DEFAULT 'NEW',
    created_at        TIMESTAMP(6)  NOT NULL
);

CREATE INDEX idx_application_status ON application (status, created_at);
