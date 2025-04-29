import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ISPProvider, Filters } from '../types';
import ProviderCard from './ProviderCard';
import '../styles/ProviderList.css';

interface ProviderListProps {
  providers: ISPProvider[];
  filters: Filters;
  sortBy: string;
  useDiscountPrice: boolean;
  onCompare: (providers: ISPProvider[]) => void;
}

const ProviderList: React.FC<ProviderListProps> = ({ 
  providers, 
  filters, 
  sortBy,
  useDiscountPrice,
  onCompare
}) => {
  const { t } = useTranslation();
  const [filteredProviders, setFilteredProviders] = useState<ISPProvider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<ISPProvider[]>([]);
  const [maxSelections] = useState(3); // 最多可以选择3个进行比较

  // 筛选和排序提供商
  useEffect(() => {
    let result = [...providers];
    
    // 筛选速度等级
    if (filters.speedTier !== 'all') {
      result = result.filter(provider => {
        const plan = provider.plans[filters.speedTier];
        return plan && (plan.rrpPrice !== "---" || plan.discountPrice !== "---");
      });
    }
    
    // 筛选价格范围
    result = result.filter(provider => {
      if (filters.speedTier === 'all') return true; // 如果没选择速度，不筛选价格
      
      const plan = provider.plans[filters.speedTier];
      if (!plan) return false;
      
      const price = useDiscountPrice 
        ? (typeof plan.discountPrice === 'number' ? plan.discountPrice : 999)
        : (typeof plan.rrpPrice === 'number' ? plan.rrpPrice : 999);
      
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    
    // 筛选Google评分
    if (filters.rating > 0) {
      result = result.filter(provider => {
        const rating = provider.googleReviews.score;
        return typeof rating === 'number' && rating >= filters.rating;
      });
    }
    
    // 筛选支持的语言 - 增强的过滤逻辑
    if (filters.language.length > 0) {
      result = result.filter(provider => {
        // 提供商必须支持所有选定的语言
        return filters.language.every(selectedLang => {
          return provider.supportedLanguages.some(supported => {
            // 语言名称标准化 (例如: "Chinese (Mandarin and Cantonese)" 应匹配 "Chinese")
            if (selectedLang === 'Chinese') {
              return supported.includes('Chinese') || supported.includes('Mandarin') || supported.includes('Cantonese');
            } else if (selectedLang === 'Hindi') {
              return supported.includes('Hindi') || supported.includes('Punjabi');
            } else {
              return supported.toLowerCase().includes(selectedLang.toLowerCase());
            }
          });
        });
      });
    }
    
    // 筛选网络类型
    if (filters.networkType.length > 0) {
      result = result.filter(provider => {
        return filters.networkType.some(type => 
          provider.networkTypes[type as keyof typeof provider.networkTypes]
        );
      });
    }
    
    // 筛选客服时间
    if (filters.supportHours.type !== 'all' && filters.supportHours.value !== 'all') {
      result = result.filter(provider => {
        const hourType = filters.supportHours.type;
        const hourValue = filters.supportHours.value;
        const hours = provider.operationHours[hourType as keyof typeof provider.operationHours];
        
        if (!hours || hours === "---") return false;
        
        // 根据不同时间类型筛选
        switch (hourValue) {
          case '24_7':
            return hours.toLowerCase().includes('24/7') || hours.toLowerCase().includes('24 hours');
          case 'extended':
            return hours.includes('10pm') || hours.includes('9pm') || hours.includes('midnight');
          case 'weekend':
            return hours.toLowerCase().includes('weekend') || hours.toLowerCase().includes('sat') || hours.toLowerCase().includes('sun');
          case 'evening':
            return hours.includes('8pm') || hours.includes('9pm') || hours.includes('10pm');
          default:
            return true;
        }
      });
    }
    
    // 筛选支持渠道
    if (filters.supportChannel.length > 0) {
      result = result.filter(provider => {
        return filters.supportChannel.some(channel => {
          if (channel === 'phone' || channel === 'liveChat' || channel === 'email') {
            return !!provider.supportChannels[channel as keyof typeof provider.supportChannels];
          } else if (channel === 'socialMedia') {
            return provider.supportChannels.socialMedia !== "---" && 
                   provider.supportChannels.socialMedia !== "Not specified";
          } else if (channel === 'app') {
            return provider.supportChannels.other.toLowerCase().includes('app');
          } else if (channel === 'messaging') {
            const social = provider.supportChannels.socialMedia.toLowerCase();
            return social.includes('whatsapp') || 
                   social.includes('messenger') || 
                   social.includes('wechat');
          }
          return false;
        });
      });
    }
    
    // 排序
    result.sort((a, b) => {
      if (sortBy === 'price') {
        const getPrice = (provider: ISPProvider) => {
          if (filters.speedTier === 'all') return 0;
          
          const plan = provider.plans[filters.speedTier];
          if (!plan) return 999;
          
          return useDiscountPrice
            ? (typeof plan.discountPrice === 'number' ? plan.discountPrice : 999)
            : (typeof plan.rrpPrice === 'number' ? plan.rrpPrice : 999);
        };
        
        return getPrice(a) - getPrice(b);
      } 
      else if (sortBy === 'speed') {
        const getSpeed = (provider: ISPProvider) => {
          if (filters.speedTier === 'all') return 0;
          
          const plan = provider.plans[filters.speedTier];
          if (!plan || plan.typicalEveningSpeed === "---") return 0;
          
          // 从 "100/40" 格式中提取下载速度
          const download = parseInt(plan.typicalEveningSpeed.split('/')[0]);
          return isNaN(download) ? 0 : download;
        };
        
        return getSpeed(b) - getSpeed(a); // 速度从高到低
      } 
      else if (sortBy === 'rating') {
        const getRating = (provider: ISPProvider) => {
          return typeof provider.googleReviews.score === 'number' 
            ? provider.googleReviews.score 
            : 0;
        };
        
        return getRating(b) - getRating(a); // 评分从高到低
      }
      else if (sortBy === 'value') {
        const getValue = (provider: ISPProvider) => {
          if (filters.speedTier === 'all') return 0;
          
          const plan = provider.plans[filters.speedTier];
          if (!plan || plan.typicalEveningSpeed === "---") return 999;
          
          const price = useDiscountPrice
            ? (typeof plan.discountPrice === 'number' ? plan.discountPrice : 999)
            : (typeof plan.rrpPrice === 'number' ? plan.rrpPrice : 999);
          
          // 从 "100/40" 格式中提取下载速度
          const download = parseInt(plan.typicalEveningSpeed.split('/')[0]);
          if (isNaN(download) || download === 0) return 999;
          
          // 价值 = 价格/速度，越低越好
          return price / download;
        };
        
        return getValue(a) - getValue(b);
      }
      
      return 0;
    });
    
    setFilteredProviders(result);
  }, [providers, filters, sortBy, useDiscountPrice]);
  
  // 处理提供商选择
  const handleProviderSelect = (provider: ISPProvider) => {
    const isSelected = selectedProviders.some(p => p.id === provider.id);
    
    if (isSelected) {
      // 如果已选中，则移除
      setSelectedProviders(selectedProviders.filter(p => p.id !== provider.id));
    } else {
      // 如果未选中，且未达到最大选择数量，则添加
      if (selectedProviders.length < maxSelections) {
        setSelectedProviders([...selectedProviders, provider]);
      } else {
        // 弹出提示或替换最早选择的提供商
        alert(t('comparison.maxSelectionsReached', { max: maxSelections }));
      }
    }
  };
  
  // 当选择的提供商变化时，通知父组件
  useEffect(() => {
    if (selectedProviders.length >= 2) {
      onCompare(selectedProviders);
    }
  }, [selectedProviders, onCompare]);
  
  // 检查提供商是否已选中
  const isProviderSelected = (provider: ISPProvider) => {
    return selectedProviders.some(p => p.id === provider.id);
  };
  
  // 获取选择计数显示
  const getSelectionCountText = () => {
    return t('comparison.selectedCount', { 
      current: selectedProviders.length,
      max: maxSelections 
    });
  };
  
  // 比较按钮是否可用
  const isCompareEnabled = selectedProviders.length >= 2;

  return (
    <div className="provider-list">
      <div className="provider-list-header">
        <h2>{t('comparison.providers')}</h2>
        <div className="selection-counter">
          {getSelectionCountText()}
        </div>
        <button 
          className={`compare-button ${isCompareEnabled ? 'enabled' : 'disabled'}`}
          disabled={!isCompareEnabled}
          onClick={() => onCompare(selectedProviders)}
        >
          {t('comparison.compare')}
        </button>
      </div>
      
      {filteredProviders.length === 0 ? (
        <div className="no-results">
          <p>{t('comparison.noResults')}</p>
        </div>
      ) : (
        <div className="provider-cards">
          {filteredProviders.map(provider => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              selectedSpeed={filters.speedTier === 'all' ? '50M' : filters.speedTier} // 如果没选速度，默认显示50M的价格
              useDiscountPrice={useDiscountPrice}
              onSelect={handleProviderSelect}
              isSelected={isProviderSelected(provider)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderList; 