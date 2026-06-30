package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RulesPage extends BasePage {

    private static final By HEADING        = By.cssSelector("h1");
    private static final By SECTION_POINTS = By.xpath("//h2[contains(text(),'Punktevergabe')]");
    private static final By SECTION_PRIZES = By.xpath("//h2[contains(text(),'Einsatz') or contains(text(),'Gewinn')]");
    private static final By SECTION_TIPS   = By.xpath("//h2[contains(text(),'Tipps')]");
    private static final By SECTION_ABOUT  = By.xpath("//h2[contains(text(),'Über')]");
    private static final By BADGE_3_POINTS = By.xpath("//*[text()='3' and contains(@class,'text-wm-gold')]");
    private static final By BADGE_1_POINT  = By.xpath("//*[text()='1' and contains(@class,'text-wm-green')]");
    private static final By BADGE_0_POINTS = By.xpath("//*[text()='0']");
    private static final By KO_RULE        = By.xpath("//*[contains(text(),'K.O') or contains(text(),'KO') or contains(text(),'verdoppeln')]");
    private static final By KO_EXACT_PTS   = By.xpath("//*[contains(text(),'6 Punkte')]");
    private static final By PRIZE_FIRST    = By.xpath("//*[contains(text(),'1. Platz') or contains(text(),'40')]");

    public RulesPage(WebDriver driver) {
        super(driver);
    }

    public RulesPage open() {
        navigate("/rules");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public boolean hasScoringSection() {
        return isPresent(SECTION_POINTS);
    }

    public boolean hasPrizesSection() {
        return isPresent(SECTION_PRIZES);
    }

    public boolean hasTipsSection() {
        return isPresent(SECTION_TIPS);
    }

    public boolean hasAboutSection() {
        return isPresent(SECTION_ABOUT);
    }

    public boolean hasThreePointBadge() {
        return isPresent(BADGE_3_POINTS);
    }

    public boolean hasOnePointBadge() {
        return isPresent(BADGE_1_POINT);
    }

    public boolean hasKoDoublePointsRule() {
        return isPresent(KO_RULE);
    }

    public boolean hasKoExactSixPoints() {
        return isPresent(KO_EXACT_PTS);
    }

    public boolean hasPrizesDistribution() {
        return isPresent(PRIZE_FIRST);
    }
}
