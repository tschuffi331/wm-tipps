package de.wmtipps.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class LeaderboardPage extends BasePage {

    private static final By HEADING       = By.cssSelector("h1");
    private static final By TABLE         = By.cssSelector("table");
    private static final By TABLE_ROWS    = By.cssSelector("tbody tr");
    private static final By EMPTY_MSG     = By.xpath("//*[contains(text(),'Noch keine Einträge')]");
    private static final By COL_POINTS    = By.xpath("//th[contains(text(),'Punkte')]");
    private static final By COL_EXACT     = By.xpath("//th[contains(text(),'Exakt')]");
    private static final By COL_PLAYER    = By.xpath("//th[contains(text(),'Spieler')]");

    public LeaderboardPage(WebDriver driver) {
        super(driver);
    }

    public LeaderboardPage open() {
        navigate("/leaderboard");
        return this;
    }

    public String getHeading() {
        return waitVisible(HEADING).getText();
    }

    public boolean isTableVisible() {
        return isPresent(TABLE);
    }

    public boolean isEmptyMessageVisible() {
        return isPresent(EMPTY_MSG);
    }

    public List<WebElement> getRows() {
        return driver.findElements(TABLE_ROWS);
    }

    public int getEntryCount() {
        return getRows().size();
    }

    public boolean hasPointsColumn() {
        return isPresent(COL_POINTS);
    }

    public boolean hasExactColumn() {
        return isPresent(COL_EXACT);
    }

    public boolean hasPlayerColumn() {
        return isPresent(COL_PLAYER);
    }
}
