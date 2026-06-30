package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class HomePage extends BasePage {

    private static final By HEADING      = By.cssSelector("h1");
    private static final By GROUP_CARDS  = By.xpath("//*[contains(@class,'rounded-xl') and .//*[contains(text(),'Gruppe')]]");
    private static final By GROUP_HEADER = By.xpath("//*[contains(text(),'Gruppe A') or contains(text(),'Gruppe B')]");
    private static final By COUNTDOWN    = By.xpath("//*[contains(@class,'countdown') or contains(text(),'startet') or contains(text(),'Spiele')]");

    public HomePage(WebDriver driver) {
        super(driver);
    }

    public HomePage open() {
        navigate("/");
        return this;
    }

    public String getMainHeading() {
        return waitVisible(HEADING).getText();
    }

    public List<WebElement> getGroupCards() {
        waitVisible(GROUP_HEADER);
        return driver.findElements(By.xpath(
            "//*[contains(@class,'rounded-xl') and .//h3[contains(text(),'Gruppe')]]"
        ));
    }

    public boolean hasGroupCard(String groupLetter) {
        waitVisible(GROUP_HEADER);
        return isPresent(By.xpath(
            String.format("//h3[contains(text(),'Gruppe %s')]", groupLetter)
        ));
    }

    public int getGroupCardCount() {
        return getGroupCards().size();
    }

    public boolean hasLoginCallToAction() {
        return isPresent(By.xpath("//*[contains(@href,'#/login') or contains(@href,'login')]"));
    }
}
