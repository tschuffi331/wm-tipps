package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.config.TestConfig;
import de.wmtipps.selenium.pages.LoginPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("LoginPage")
class LoginPageTest extends BaseTest {

    @Test
    @DisplayName("Seite zeigt 'Anmelden'-Überschrift")
    void pageHasHeading() {
        LoginPage page = new LoginPage(driver).open();
        assertEquals("Anmelden", page.getHeading());
    }

    @Test
    @DisplayName("Formular enthält Benutzername- und Passwort-Felder")
    void formHasRequiredFields() {
        LoginPage page = new LoginPage(driver).open();
        assertTrue(page.isUsernameFieldPresent(), "Benutzername-Feld sollte vorhanden sein");
        assertTrue(page.isPasswordFieldPresent(), "Passwort-Feld sollte vorhanden sein");
    }

    @Test
    @DisplayName("Labels sind korrekt mit Inputs verknüpft (htmlFor/id)")
    void labelsAreAssociatedWithInputs() {
        LoginPage page = new LoginPage(driver).open();
        assertEquals("Benutzername", page.getUsernameLabel());
        assertEquals("Passwort", page.getPasswordLabel());
    }

    @Test
    @DisplayName("Submit-Button ist sichtbar und aktiv")
    void submitButtonIsEnabled() {
        LoginPage page = new LoginPage(driver).open();
        assertTrue(page.isSubmitEnabled(), "Anmelden-Button sollte aktiv sein");
    }

    @Test
    @DisplayName("Link zur Registrierungsseite vorhanden")
    void hasRegisterLink() {
        LoginPage page = new LoginPage(driver).open();
        assertTrue(page.isRegisterLinkVisible(), "Registrierungs-Link sollte vorhanden sein");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Anmelden'")
    void pageTitleContainsAnmelden() {
        LoginPage page = new LoginPage(driver).open();
        assertTrue(page.getPageTitle().contains("Anmelden"));
    }

    @Test
    @DisplayName("Falsche Zugangsdaten zeigen Fehlermeldung")
    void wrongCredentialsShowError() throws InterruptedException {
        LoginPage page = new LoginPage(driver).open();
        page.fillUsername("__nonexistent_user__");
        page.fillPassword("wrongpassword");
        page.submit();
        // Wait for toast error — give the API call time to respond
        Thread.sleep(3000);
        String bodyText = driver.findElement(org.openqa.selenium.By.tagName("body")).getText();
        assertTrue(
            bodyText.contains("fehlgeschlagen") || bodyText.contains("Fehler") || bodyText.contains("falsch")
                || page.getCurrentUrl().contains("login"),
            "Nach falschen Zugangsdaten sollte eine Fehlermeldung erscheinen oder auf Login-Seite bleiben"
        );
    }

    @Test
    @DisplayName("Erfolgreiches Login leitet auf /tips weiter")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void successfulLoginRedirectsToTips() {
        new LoginPage(driver).loginAs(TestConfig.TEST_USERNAME, TestConfig.TEST_PASSWORD);
        assertTrue(driver.getCurrentUrl().contains("tips"),
            "Nach Login sollte auf /tips weitergeleitet werden");
    }
}
