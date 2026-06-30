package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.config.TestConfig;
import de.wmtipps.selenium.pages.ProfilePage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ProfilePage (geschützt)")
class ProfilePageTest extends BaseTest {

    @Test
    @DisplayName("Nicht eingeloggte Nutzer werden auf /login weitergeleitet")
    void redirectsToLoginWhenNotAuthenticated() {
        new ProfilePage(driver).open();
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Unauthentifizierte Nutzer sollten auf /login weitergeleitet werden");
    }

    @Test
    @DisplayName("Eingeloggter Nutzer sieht Profil-Überschrift 'Mein Profil'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void showsProfileHeading() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        assertTrue(page.getHeading().contains("Profil"),
            "Überschrift sollte 'Profil' enthalten");
    }

    @Test
    @DisplayName("Benutzername des eingeloggten Nutzers wird angezeigt")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void showsLoggedInUsername() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        String displayedName = page.getDisplayedUsername();
        assertTrue(
            displayedName.toLowerCase().contains(TestConfig.TEST_USERNAME.toLowerCase()),
            "Benutzername '" + TestConfig.TEST_USERNAME + "' sollte auf der Profilseite angezeigt werden"
        );
    }

    @Test
    @DisplayName("Abmelden-Button ist vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void hasLogoutButton() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        assertTrue(page.isLogoutButtonVisible(), "Abmelden-Button sollte vorhanden sein");
    }

    @Test
    @DisplayName("Profilbild-Upload-Button ist vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void hasAvatarUploadButton() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        assertTrue(page.isAvatarUploadVisible(), "Profilbild-Button sollte vorhanden sein");
    }

    @Test
    @DisplayName("'Passwort ändern'-Abschnitt ist vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void hasPasswordChangeSection() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        assertTrue(page.isPasswordSectionVisible(), "'Passwort ändern' sollte vorhanden sein");
    }

    @Test
    @DisplayName("'Passwort ändern' öffnet Passwort-Formular")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void passwordSectionExpandsToForm() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        page.openPasswordSection();
        assertTrue(page.isPasswordFormVisible(),
            "Passwort-Formular sollte nach Klick auf 'Passwort ändern' sichtbar sein");
    }

    @Test
    @DisplayName("Abmelden leitet auf Startseite weiter")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void logoutNavigatesToHome() {
        loginAsTestUser();
        ProfilePage page = new ProfilePage(driver).open();
        page.clickLogout();
        pause(1500);
        assertFalse(driver.getCurrentUrl().contains("profile"),
            "Nach Abmelden sollte nicht mehr auf /profile sein");
    }

    private void pause(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }
}
