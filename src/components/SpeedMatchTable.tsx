import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/SpeedMatchTable.css';

const SpeedMatchTable: React.FC = () => {
  const { t } = useTranslation();

  // Icons for different statuses
  const renderStatus = (status: 'good' | 'moderate' | 'bad' | 'limited', text: string) => {
    switch (status) {
      case 'good':
        return (
          <div className="status-cell good">
            <FaCheck className="status-icon" /> {text}
          </div>
        );
      case 'moderate':
        return (
          <div className="status-cell moderate">
            <span className="moderate-icon">⊘</span> {text}
          </div>
        );
      case 'bad':
        return (
          <div className="status-cell bad">
            <FaTimes className="status-icon" /> {text}
          </div>
        );
      case 'limited':
        return (
          <div className="status-cell limited">
            <span className="limited-icon">⚠</span> {text}
          </div>
        );
    }
  };

  return (
    <div className="speed-match-container">
      <h2 className="speed-match-title">{t('speedMatch.title', 'What can my internet handle?')}</h2>
      <p className="speed-match-subtitle">
        {t('speedMatch.subtitle', 'We\'ve matched each speed tier with how well it handles six everyday activities. Just find the tasks you do at home, and match it to the plan that keeps everything running smoothly.')}
      </p>

      <div className="table-responsive">
        <table className="speed-match-table">
          <thead>
            <tr>
              <th className="activity-column">{t('speedMatch.activity', 'Activity')}</th>
              <th>{t('speedMatch.basic', '25Mbps (Basic)')}</th>
              <th>{t('speedMatch.everyday', '50Mbps (Everyday)')}</th>
              <th>{t('speedMatch.family', '100Mbps (Family Favourite)')}</th>
              <th>{t('speedMatch.power', '250Mbps (Power User)')}</th>
              <th>{t('speedMatch.elite', '1000Mbps (Elite Fibre)')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="activity-name">
                {t('speedMatch.streaming', 'Streaming Netflix / Disney+ in HD')}
              </td>
              <td>{renderStatus('good', t('speedMatch.oneScreen', '1 screen'))}</td>
              <td>{renderStatus('good', t('speedMatch.twoToThreeScreens', '2–3 screens'))}</td>
              <td>{renderStatus('good', t('speedMatch.fourKTwo', '4K on 2–3 screens'))}</td>
              <td>{renderStatus('good', t('speedMatch.fourKHousehold', '4K across household'))}</td>
              <td>{renderStatus('good', t('speedMatch.allDevices', 'All devices, no buffering'))}</td>
            </tr>
            <tr>
              <td className="activity-name">
                {t('speedMatch.videoCalls', 'Zoom/Teams calls')}
              </td>
              <td>{renderStatus('good', t('speedMatch.oneCall', '1 call'))}</td>
              <td>{renderStatus('good', t('speedMatch.twoToThreeCalls', '2–3 calls'))}</td>
              <td>{renderStatus('good', t('speedMatch.groupCalls', 'Group calls + multitasking'))}</td>
              <td>{renderStatus('good', t('speedMatch.fivePlusCalls', '5+ calls at once'))}</td>
              <td>{renderStatus('good', t('speedMatch.flawless', 'Flawless, zero lag'))}</td>
            </tr>
            <tr>
              <td className="activity-name">
                {t('speedMatch.gaming', 'Online gaming (e.g. Fortnite, FIFA)')}
              </td>
              <td>{renderStatus('bad', t('speedMatch.riskLag', 'Risk of lag'))}</td>
              <td>{renderStatus('good', t('speedMatch.soloPlay', 'Solo play'))}</td>
              <td>{renderStatus('good', t('speedMatch.multiPlayer', 'Multi-player & downloads'))}</td>
              <td>{renderStatus('good', t('speedMatch.fastDownloads', 'Fast downloads + zero lag'))}</td>
              <td>{renderStatus('good', t('speedMatch.proLevel', 'Pro-level performance'))}</td>
            </tr>
            <tr>
              <td className="activity-name">
                {t('speedMatch.largeDownloads', 'Large file downloads (1GB+)')}
              </td>
              <td>{renderStatus('moderate', t('speedMatch.slow', 'Slow (~5–7 mins)'))}</td>
              <td>{renderStatus('moderate', t('speedMatch.moderate', 'Moderate (~3–5 mins)'))}</td>
              <td>{renderStatus('good', t('speedMatch.fast', 'Fast (~1–2 mins)'))}</td>
              <td>{renderStatus('good', t('speedMatch.veryFast', 'Very fast (<1 min)'))}</td>
              <td>{renderStatus('good', t('speedMatch.instantLike', 'Instant-like (~seconds)'))}</td>
            </tr>
            <tr>
              <td className="activity-name">
                {t('speedMatch.multipleDevices', 'Multiple devices online (3+)')}
              </td>
              <td>{renderStatus('bad', t('speedMatch.struggles', 'Struggles'))}</td>
              <td>{renderStatus('limited', t('speedMatch.lightUse', 'Light use only'))}</td>
              <td>{renderStatus('good', t('speedMatch.fiveDevices', 'Handles 5+ devices'))}</td>
              <td>{renderStatus('good', t('speedMatch.tenDevices', 'Handles 10+ devices'))}</td>
              <td>{renderStatus('good', t('speedMatch.everything', 'Everything, all at once'))}</td>
            </tr>
            <tr>
              <td className="activity-name">
                {t('speedMatch.kidsStreaming', 'Kids streaming + gaming')}
              </td>
              <td>{renderStatus('bad', t('speedMatch.lagLikely', 'Lag likely'))}</td>
              <td>{renderStatus('limited', t('speedMatch.okayLimits', 'Okay with limits'))}</td>
              <td>{renderStatus('good', t('speedMatch.smoothBoth', 'Smooth for both'))}</td>
              <td>{renderStatus('good', t('speedMatch.zeroInterruption', 'Zero interruption'))}</td>
              <td>{renderStatus('good', t('speedMatch.peakPerformance', 'Peak performance always'))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpeedMatchTable; 