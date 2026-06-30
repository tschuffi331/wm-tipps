package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.HomePage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("HomePage")
class HomePageTest extends BaseTest {

    @Test
    @DisplayName("Seite lädt und zeigt Hauptüberschrift")
    void pageLoadsWithHeading() {
        HomePage page = new HomePage(driver).open();
        assertTrue(page.getMainHeading().contains("WM Tipps"),
            "Hauptüberschrift sollte 'WM Tipps' enthalten");
    }

    @Test
    @DisplayName("Alle 12 Gruppen (A–L) werden angezeigt")
    void showsAllTwelveGroups() {
        HomePage page = new HomePage(driver).open();
        assertEquals(12, page.getGroupCardCount(),
            "Es sollten genau 12 Gruppen-Kacheln angezeigt werden");
    }

    @Test
    @DisplayName("Gruppenübersicht enthält Gruppe A und Gruppe L")
    void showsGroupAAndGroupL() {
        HomePage page = new HomePage(driver).open();
        assertTrue(page.hasGroupCard("A"), "Gruppe A sollte vorhanden sein");
        assertTrue(page.hasGroupCard("L"), "Gruppe L sollte vorhanden sein");
    }

    @Test
    @DisplayName("Seitentitel enthält 'WM Tipps 2026'")
    void pageTitleContainsWmTipps() {
        HomePage page = new HomePage(driver).open();
        assertTrue(page.getPageTitle().contains("WM Tipps 2026"),
            "document.title sollte 'WM Tipps 2026' enthalten");
    }

    @Test
    @DisplayName("Navbar zeigt Rangliste- und Regeln-Links")
    void navbarHasPublicLinks() {
        new HomePage(driver).open();
        var navbar = new HomePage(driver).open().navbar();
        assertTrue(navbar.isLeaderboardLinkVisible(), "Rangliste-Link sollte sichtbar sein");
        assertTrue(navbar.isRulesLinkVisible(), "Regeln-Link sollte sichtbar sein");
    }

    @Test
    @DisplayName("Navbar zeigt Login- und Registrieren-Links für nicht eingeloggte Nutzer")
    void navbarHasLoginAndRegisterForGuests() {
        new HomePage(driver).open();
        var navbar = new HomePage(driver).open().navbar();
        assertTrue(navbar.isLoginLinkVisible(), "Login-Link sollte für Gäste sichtbar sein");
        assertTrue(navbar.isRegisterLinkVisible(), "Registrieren-Link sollte für Gäste sichtbar sein");
    }
}
