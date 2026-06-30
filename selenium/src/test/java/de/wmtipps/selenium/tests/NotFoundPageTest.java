package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.NotFoundPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("NotFoundPage (404)")
class NotFoundPageTest extends BaseTest {

    @Test
    @DisplayName("Unbekannte Route zeigt 404-Seite")
    void unknownRouteShows404() {
        NotFoundPage page = new NotFoundPage(driver).open();
        assertTrue(page.getHeading().toLowerCase().contains("nicht gefunden")
                || page.getHeading().toLowerCase().contains("not found"),
            "404-Überschrift sollte 'nicht gefunden' enthalten");
    }

    @Test
    @DisplayName("Link zurück zur Startseite ist vorhanden")
    void hasHomeLinkOnNotFoundPage() {
        NotFoundPage page = new NotFoundPage(driver).open();
        assertTrue(page.hasHomeLink(), "Link zur Startseite sollte auf der 404-Seite vorhanden sein");
    }

    @Test
    @DisplayName("Humorvolle Abseits-Meldung wird angezeigt")
    void hasHumourousAbseitsMeldung() {
        NotFoundPage page = new NotFoundPage(driver).open();
        assertTrue(page.hasHumourousMessage(), "Abseits-Witz oder 'nicht gefunden'-Meldung sollte angezeigt werden");
    }

    @Test
    @DisplayName("Link zurück zur Startseite funktioniert")
    void homeLinkNavigatesToHome() {
        NotFoundPage page = new NotFoundPage(driver).open();
        page.clickHomeLink();
        assertTrue(driver.getCurrentUrl().endsWith("#/") || driver.getCurrentUrl().endsWith("wm-tipps/"),
            "Home-Link sollte auf die Startseite navigieren");
    }
}
