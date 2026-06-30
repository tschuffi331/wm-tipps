package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class GroupsPage extends BasePage {

    private static final By HEADING       = By.cssSelector("h1");
    private static final By GROUP_CARDS   = By.xpath("//div[.//h3[contains(text(),'Gruppe')]]");
    private static final By STANDINGS_TBL = By.cssSelector("table");
    private static final By LEGEND_DIRECT = By.xpath("//*[contains(text(),'Sechzehntelfinale sicher')]");
    private static final By LEGEND_MAYBE  = By.xpath("//*[contains(text(),'evtl.') or contains(text(),'Gruppendritter')]");

    public GroupsPage(WebDriver driver) {
        super(driver);
    }

    public GroupsPage open() {
        navigate("/groups");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public List<WebElement> getGroupCards() {
        waitVisible(HEADING);
        return driver.findElements(GROUP_CARDS);
    }

    public int getGroupCardCount() {
        return getGroupCards().size();
    }

    public boolean hasGroupCard(String groupLetter) {
        waitVisible(HEADING);
        return isPresent(By.xpath(
            String.format("//h3[contains(text(),'Gruppe %s')]", groupLetter)
        ));
    }

    public boolean hasStandingsTables() {
        return !driver.findElements(STANDINGS_TBL).isEmpty();
    }

    public boolean hasQualificationLegend() {
        return isPresent(LEGEND_DIRECT);
    }

    public boolean hasMaybeLegend() {
        return isPresent(LEGEND_MAYBE);
    }
}
