package za.co.velichildacademy.application;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "application")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_first_name", nullable = false, length = 80)
    private String childFirstName;

    @Column(name = "child_last_name", nullable = false, length = 80)
    private String childLastName;

    @Column(name = "child_birth_date", nullable = false)
    private LocalDate childBirthDate;

    @Column(nullable = false, length = 20)
    private String grade;

    @Column(name = "start_year", nullable = false)
    private int startYear;

    @Column(name = "previous_school", length = 150)
    private String previousSchool;

    @Column(name = "parent_name", nullable = false, length = 100)
    private String parentName;

    @Column(nullable = false, length = 40)
    private String relationship;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(length = 300)
    private String address;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private boolean consent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.NEW;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Long getId() { return id; }
    public String getChildFirstName() { return childFirstName; }
    public void setChildFirstName(String v) { this.childFirstName = v; }
    public String getChildLastName() { return childLastName; }
    public void setChildLastName(String v) { this.childLastName = v; }
    public LocalDate getChildBirthDate() { return childBirthDate; }
    public void setChildBirthDate(LocalDate v) { this.childBirthDate = v; }
    public String getGrade() { return grade; }
    public void setGrade(String v) { this.grade = v; }
    public int getStartYear() { return startYear; }
    public void setStartYear(int v) { this.startYear = v; }
    public String getPreviousSchool() { return previousSchool; }
    public void setPreviousSchool(String v) { this.previousSchool = v; }
    public String getParentName() { return parentName; }
    public void setParentName(String v) { this.parentName = v; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String v) { this.relationship = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public boolean isConsent() { return consent; }
    public void setConsent(boolean v) { this.consent = v; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus v) { this.status = v; }
    public Instant getCreatedAt() { return createdAt; }
}
