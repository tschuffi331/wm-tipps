package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.AdminPage;
import de.wmtipps.selenium.pages.LoginPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("AdminPage (nur Admin)")
class AdminPageTest extends BaseTest {

    @Test
    @DisplayName("Nicht eingeloggte Nutzer werden auf /login weitergeleitet")
    void redirectsToLoginWhenNotAuthenticated() {
        new AdminPage(driver).open();
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Nicht eingeloggte Nutzer sollten auf /login weitergeleitet werden");
    }

    @Test
    @DisplayName("Normaler Nutzer wird von Admin-Seite umgeleitet")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void regularUserIsRedirectedFromAdmin() {
        loginAsTestUser();
        new AdminPage(driver).open();
        assertFalse(driver.getCurrentUrl().contains("admin")
                && !driver.getCurrentUrl().contains("login"),
            "Normaler Nutzer sollte keinen Zugriff auf die Admin-Seite haben");
    }

    @Test
    @DisplayName("Admin-Nutzer sieht Admin-Überschrift")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasAdminCredentials")
    void adminUserSeesHeading() {
        loginAsAdmin();
        AdminPage page = new AdminPage(driver).open();
        assertTrue(page.getHeading().toLowerCase().contains("admin")
                || page.getHeading().toLowerCase().contains("verwaltung"),
            "Admin-Seite sollte 'Admin' oder 'Verwaltung' in der Überschrift haben");
    }

    @Test
    @DisplayName("Button 'Aktuelle Ergebnisse abrufen' ist vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasAdminCredentials")
    void hasFetchResultsButton() {
        loginAsAdmin();
        AdminPage page = new AdminPage(driver).open();
        assertTrue(page.hasFetchResultsButton(),
            "Button 'Aktuelle Ergebnisse abrufen' sollte vorhanden sein");
    }

    @Test
    @DisplayName("Passwort-Regeln-Abschnitt ist vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasAdminCredentials")
    void hasPasswordRulesSection() {
        loginAsAdmin();
        AdminPage page = new AdminPage(driver).open();
        assertTrue(page.hasPasswordRulesSection(),
            "Passwort-Regeln-Abschnitt sollte im Admin vorhanden sein");
    }

    @Test
    @DisplayName("Spielliste zeigt Spiele an")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasAdminCredentials")
    void adminShowsMatchList() {
        loginAsAdmin();
        AdminPage page = new AdminPage(driver).open();
        assertTrue(page.hasMatchEntries(),
            "Admin sollte Spiele mit Ergebnis-Eingabe anzeigen");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Admin'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasAdminCredentials")
    void pageTitleContainsAdmin() {
        loginAsAdmin();
        AdminPage page = new AdminPage(driver).open();
        assertTrue(page.getPageTitle().toLowerCase().contains("admin"));
    }
}
