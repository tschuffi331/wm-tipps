package de.wmtipps.selenium.tests;

import de.wmtipps.selenium.pages.RulesPage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RulesPage")
class RulesPageTest extends BaseTest {

    @Test
    @DisplayName("Seite zeigt 'Regeln & Punktesystem'-Überschrift")
    void pageHasHeading() {
        RulesPage page = new RulesPage(driver).open();
        assertTrue(page.getHeading().contains("Regeln"), "Überschrift sollte 'Regeln' enthalten");
    }

    @Test
    @DisplayName("Abschnitt 'Punktevergabe' ist vorhanden")
    void hasScoringSection() {
        assertTrue(new RulesPage(driver).open().hasScoringSection());
    }

    @Test
    @DisplayName("Abschnitt 'Einsatz & Gewinnverteilung' ist vorhanden")
    void hasPrizesSection() {
        assertTrue(new RulesPage(driver).open().hasPrizesSection());
    }

    @Test
    @DisplayName("Abschnitt 'Tipps abgeben' ist vorhanden")
    void hasTipsSection() {
        assertTrue(new RulesPage(driver).open().hasTipsSection());
    }

    @Test
    @DisplayName("Abschnitt 'Über diese Seite' ist vorhanden")
    void hasAboutSection() {
        assertTrue(new RulesPage(driver).open().hasAboutSection());
    }

    @Test
    @DisplayName("3-Punkte-Badge für exaktes Ergebnis angezeigt")
    void shows3PointBadge() {
        assertTrue(new RulesPage(driver).open().hasThreePointBadge(),
            "3-Punkte-Badge sollte angezeigt werden");
    }

    @Test
    @DisplayName("1-Punkte-Badge für richtigen Ausgang angezeigt")
    void shows1PointBadge() {
        assertTrue(new RulesPage(driver).open().hasOnePointBadge(),
            "1-Punkte-Badge sollte angezeigt werden");
    }

    @Test
    @DisplayName("KO-Runden-Verdopplungsregel wird erklärt")
    void hasKoDoublePointsRule() {
        assertTrue(new RulesPage(driver).open().hasKoDoublePointsRule(),
            "Verdopplungsregel für KO-Runden sollte beschrieben sein");
    }

    @Test
    @DisplayName("6 Punkte für exaktes KO-Ergebnis werden erwähnt")
    void hasKoSixPoints() {
        assertTrue(new RulesPage(driver).open().hasKoExactSixPoints(),
            "'6 Punkte' für KO-Exakt-Treffer sollte angezeigt werden");
    }

    @Test
    @DisplayName("Preisverteilung (40% / 30%) wird angezeigt")
    void hasPrizesDistribution() {
        assertTrue(new RulesPage(driver).open().hasPrizesDistribution(),
            "Preisverteilung sollte angezeigt werden");
    }

    @Test
    @DisplayName("Seite ohne Login zugänglich")
    void accessibleWithoutLogin() {
        RulesPage page = new RulesPage(driver).open();
        assertFalse(page.getCurrentUrl().contains("login"),
            "Regeln-Seite sollte ohne Login zugänglich sein");
    }
}
