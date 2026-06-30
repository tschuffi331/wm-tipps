package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.GroupsPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GroupsPage (geschützt)")
class GroupsPageTest extends BaseTest {

    @Test
    @DisplayName("Nicht eingeloggte Nutzer werden auf /login weitergeleitet")
    void redirectsToLoginWhenNotAuthenticated() {
        new GroupsPage(driver).open();
        assertTrue(driver.getCurrentUrl().contains("login"),
            "Unauthentifizierte Nutzer sollten auf /login weitergeleitet werden");
    }

    @Test
    @DisplayName("Nach Login sind alle 12 Gruppen-Karten vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void showsTwelveGroupCards() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertEquals(12, page.getGroupCardCount(),
            "Es sollten genau 12 Gruppen-Karten angezeigt werden");
    }

    @Test
    @DisplayName("Überschrift enthält 'Gruppen'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void headingContainsGruppen() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertTrue(page.getHeading().contains("Gruppen"),
            "Überschrift sollte 'Gruppen' enthalten");
    }

    @Test
    @DisplayName("Tabellen zeigen Tabellenstand")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void showsStandingsTables() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertTrue(page.hasStandingsTables(), "Tabellenstand-Tabellen sollten vorhanden sein");
    }

    @Test
    @DisplayName("Legende mit Qualifikationsstatus ist sichtbar")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void showsQualificationLegend() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertTrue(page.hasQualificationLegend(), "Qualifikations-Legende sollte angezeigt werden");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Gruppen'")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void pageTitleContainsGruppen() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertTrue(page.getPageTitle().contains("Gruppen"));
    }

    @Test
    @DisplayName("Gruppe A und Gruppe L sind vorhanden")
    @EnabledIf("de.wmtipps.selenium.config.TestConfig#hasTestCredentials")
    void hasGroupAAndL() {
        loginAsTestUser();
        GroupsPage page = new GroupsPage(driver).open();
        assertTrue(page.hasGroupCard("A"), "Gruppe A sollte vorhanden sein");
        assertTrue(page.hasGroupCard("L"), "Gruppe L sollte vorhanden sein");
    }
}
