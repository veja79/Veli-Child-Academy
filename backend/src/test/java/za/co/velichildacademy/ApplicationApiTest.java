package za.co.velichildacademy;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApplicationApiTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private static final String VALID = """
            {"childFirstName":"Lwazi","childLastName":"Mokoena","childBirthDate":"2021-03-14",
             "grade":"Grade R","startYear":2027,"previousSchool":"","parentName":"Thandi Mokoena",
             "relationship":"Mother","phone":"072 123 4567","email":"thandi@example.com",
             "address":"Ivory Park","notes":"","consent":true}""";

    private String token() throws Exception {
        String body = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"test-password-123\"}"))
                .andReturn().getResponse().getContentAsString();
        return json.readTree(body).get("token").asText();
    }

    @Test
    void parentCanApplyAndStaffCanFollowUp() throws Exception {
        String created = mvc.perform(post("/api/applications").contentType(MediaType.APPLICATION_JSON).content(VALID))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reference").isNumber())
                .andReturn().getResponse().getContentAsString();
        long id = json.readTree(created).get("reference").asLong();

        String token = token();
        mvc.perform(get("/api/admin/applications").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].childFirstName").value(hasItem("Lwazi")));

        mvc.perform(patch("/api/admin/applications/" + id).header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"CONTACTED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONTACTED"));
    }

    @Test
    void applicationNeedsConsentAndAValidGrade() throws Exception {
        mvc.perform(post("/api/applications").contentType(MediaType.APPLICATION_JSON)
                        .content(VALID.replace("\"consent\":true", "\"consent\":false")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.consent").exists());

        mvc.perform(post("/api/applications").contentType(MediaType.APPLICATION_JSON)
                        .content(VALID.replace("Grade R", "Grade 9")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.grade").exists());
    }

    @Test
    void applicationsAreHiddenFromThePublic() throws Exception {
        mvc.perform(get("/api/admin/applications")).andExpect(status().isUnauthorized());
    }
}
