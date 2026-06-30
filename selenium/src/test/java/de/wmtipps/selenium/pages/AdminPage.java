package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class AdminPage extends BasePage {

    private static final By HEADING        = By.cssSelector("h1");
    private static final By MATCH_ROWS     = By.cssSelector("[class*='rounded-2xl'] [class*='border-t']");
    private static final By FETCH_RESULTS_BTN = By.xpath("//button[contains(text(),'Ergebnisse abrufen') or contains(text(),'Aktuelle')]");
    private static final By SCORE_INPUTS   = By.cssSelector("input[type='number']");
    private static final By SAVE_RESULT_BTN = By.xpath("//button[contains(text(),'Speichern')]");
    private static final By CANCEL_BTN     = By.xpath("//button[contains(text(),'Abbrechen')]");
    private static final By PW_RULES_SECTION = By.xpath("//*[contains(text(),'Passwort') or contains(text(),'Zeichen')]");
    private static final By PHASE_SECTION  = By.xpath("//*[contains(text(),'Phase') or contains(text(),'Aktive')]");

    public AdminPage(WebDriver driver) {
        super(driver);
    }

    public AdminPage open() {
        navigate("/admin");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public List<WebElement> getMatchRows() {
        waitVisible(HEADING);
        return driver.findElements(MATCH_ROWS);
    }

    public boolean hasFetchResultsButton() {
        return isPresent(FETCH_RESULTS_BTN);
    }

    public boolean hasPasswordRulesSection() {
        return isPresent(PW_RULES_SECTION);
    }

    public boolean hasPhaseSection() {
        return isPresent(PHASE_SECTION);
    }

    public void clickFetchResults() {
        waitClickable(FETCH_RESULTS_BTN).click();
    }

    public boolean hasMatchEntries() {
        waitVisible(HEADING);
        return !driver.findElements(By.xpath("//div[contains(@class,'text-sm') and .//div[contains(text(),'—')]]")).isEmpty();
    }
}
