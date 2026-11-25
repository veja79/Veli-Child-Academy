package za.co.velichildacademy.application;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findAllByOrderByCreatedAtDesc();

    long countByStatus(ApplicationStatus status);
}
