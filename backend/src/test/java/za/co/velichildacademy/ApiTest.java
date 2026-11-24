package za.co.velichildacademy;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    private String loginToken() throws Exception {
        String body = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"test-password-123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return json.readTree(body).get("token").asText();
    }

    @Test
    void publicCanListSampleAnnouncements() throws Exception {
        mvc.perform(get("/api/announcements"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].pinned").value(true))
                .andExpect(jsonPath("$[*].title").value(hasItem("Registrations open: Grade R to Grade 3")));
    }

    @Test
    void unknownAnnouncementIs404() throws Exception {
        mvc.perform(get("/api/announcements/99999")).andExpect(status().isNotFound());
    }

    @Test
    void contactRequiresConsent() throws Exception {
        String noConsent = """
                {"name":"Thandi","email":"thandi@example.com","phone":"","subject":"Enrolment",
                 "message":"Do you have space for 2027?","consent":false}""";
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(noConsent))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.consent").exists());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                        .content(noConsent.replace("\"consent\":false", "\"consent\":true")))
                .andExpect(status().isCreated());
    }

    @Test
    void adminEndpointsNeedAToken() throws Exception {
        mvc.perform(get("/api/admin/announcements")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/messages")).andExpect(status().isUnauthorized());
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateAndDeleteAnnouncement() throws Exception {
        String token = loginToken();
        String request = """
                {"title":"Sports day","summary":"Wear school colours.","body":"Sports day is on Friday.",
                 "category":"EVENT","publishedAt":"2026-01-10","pinned":false,"published":true}""";

        String created = mvc.perform(post("/api/admin/announcements")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        JsonNode node = json.readTree(created);
        long id = node.get("id").asLong();

        mvc.perform(get("/api/announcements"))
                .andExpect(jsonPath("$[*].title").value(hasItem("Sports day")));

        mvc.perform(delete("/api/admin/announcements/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/announcements"))
                .andExpect(jsonPath("$[*].title").value(not(hasItem("Sports day"))));
    }

    @Test
    void draftsAndFuturePostsStayHidden() throws Exception {
        String token = loginToken();
        String draft = """
                {"title":"Draft notice","summary":"Not ready.","body":"Not ready yet.",
                 "category":"NEWS","publishedAt":"2026-01-10","pinned":false,"published":false}""";
        String future = """
                {"title":"Future notice","summary":"Later.","body":"Later.",
                 "category":"NEWS","publishedAt":"2099-01-01","pinned":false,"published":true}""";
        for (String body : new String[] {draft, future}) {
            mvc.perform(post("/api/admin/announcements").header("Authorization", "Bearer " + token)
                            .contentType(MediaType.APPLICATION_JSON).content(body))
                    .andExpect(status().isCreated());
        }
        mvc.perform(get("/api/announcements"))
                .andExpect(jsonPath("$[*].title").value(not(hasItem("Draft notice"))))
                .andExpect(jsonPath("$[*].title").value(not(hasItem("Future notice"))));
    }
}
