package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.LeaderboardPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("LeaderboardPage")
class LeaderboardPageTest extends BaseTest {

    @Test
    @DisplayName("Seite zeigt 'Rangliste'-Überschrift")
    void pageHasHeading() {
        LeaderboardPage page = new LeaderboardPage(driver).open();
        assertTrue(page.getHeading().contains("Rangliste"),
            "Überschrift sollte 'Rangliste' enthalten");
    }

    @Test
    @DisplayName("Seitentitel enthält 'Rangliste'")
    void pageTitleContainsRangliste() {
        LeaderboardPage page = new LeaderboardPage(driver).open();
        assertTrue(page.getPageTitle().contains("Rangliste"));
    }

    @Test
    @DisplayName("Rangliste zeigt Tabelle oder Leer-Meldung")
    void showsTableOrEmptyMessage() {
        LeaderboardPage page = new LeaderboardPage(driver).open();
        boolean hasContent = page.isTableVisible() || page.isEmptyMessageVisible();
        assertTrue(hasContent, "Entweder Tabelle oder Leer-Meldung sollte angezeigt werden");
    }

    @Test
    @DisplayName("Tabelle hat Spalten: Punkte, Exakt, Spieler")
    void tableHasRequiredColumns() {
        LeaderboardPage page = new LeaderboardPage(driver).open();
        if (!page.isTableVisible()) return; // skip if no entries yet
        assertTrue(page.hasPointsColumn(),  "Spalte 'Punkte' fehlt");
        assertTrue(page.hasExactColumn(),   "Spalte 'Exakt' fehlt");
        assertTrue(page.hasPlayerColumn(),  "Spalte 'Spieler' fehlt");
    }

    @Test
    @DisplayName("Rangliste ist ohne Login zugänglich")
    void accessibleWithoutLogin() {
        LeaderboardPage page = new LeaderboardPage(driver).open();
        assertFalse(page.getCurrentUrl().contains("login"),
            "Rangliste sollte ohne Login zugänglich sein");
    }
}
